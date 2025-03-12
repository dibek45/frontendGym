import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectFilteredSales } from 'src/app/state/point-of-sale/sale/sale.selectors'; // Se usa el selector correcto
import { Sale } from 'src/app/state/point-of-sale/sale/sale.model';
import { ChartType } from 'chart.js';
import { loadSales } from 'src/app/state/point-of-sale/sale/sale.actions';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
interface Expense {
  id: number;
  amount: number;
  date: string;
  category: string;
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {
  sales$: Observable<Sale[]>;
  expenses$: Observable<Expense[]>;
  public barChartType: ChartType = 'bar';

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedType: 'sales' | 'expenses' = 'sales';

  public barChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartData: { data: number[]; label: string }[] = [{ data: [], label: '' }];
  selectedTimeRange: string = '';

  constructor(private store: Store) {
    this.sales$ = this.store.select(selectFilteredSales);
    this.expenses$ = new Observable<Expense[]>(observer => {
      observer.next(this.getMockExpenses());
      observer.complete();
    });

    this.sales$.subscribe(sales => {
      const mappedSales = this.mapSalesToChartData(sales); // 🔹 Convertir ventas a formato correcto
      this.updateChart(mappedSales, 'Ventas');
    });
      }

      ngOnInit() {
        this.store.dispatch(loadSales({ gymId: 1 })); // 🔹 Se carga al iniciar el componente
      }
      

  getMockExpenses(): Expense[] {
    return [
      { id: 1, amount: 50, date: '2024-03-01', category: 'Suministros' },
      { id: 2, amount: 400, date: '2024-03-02', category: 'Mantenimiento' },
      { id: 3, amount: 3000, date: '2024-03-03', category: 'Servicios' },
    ];
  }

  onStartDateChange(event: any) {
    this.startDate = event.value;
    this.applyFilters();
  }

  onEndDateChange(event: any) {
    this.endDate = event.value;
    this.applyFilters();
  }

  onTypeChange(event: any) {
    this.selectedType = event.value;
    this.applyFilters();
  }

  compareMode: boolean = false;

  applyFilters() {
    if (this.compareMode) {
      this.sales$.subscribe(sales => {
        this.expenses$.subscribe(expenses => {
          const filteredSales = this.filterData(sales); // 🔹 Se filtran antes de mapear
          const filteredExpenses = this.filterData(expenses);
  
          const mappedSales = this.mapSalesToChartData(filteredSales);
          const mappedExpenses = this.mapExpensesToChartData(filteredExpenses);
  
          this.updateChartWithComparison(mappedSales, mappedExpenses);
        });
      });
    } else {
      if (this.selectedType === 'sales') {
        this.sales$.subscribe(sales => {
          const filteredSales = this.filterData(sales); // 🔹 Filtrar primero
          const mappedSales = this.mapSalesToChartData(filteredSales); // 🔹 Luego mapear
          this.updateChart(mappedSales, 'Ventas');
        });
      } else {
        this.expenses$.subscribe(expenses => {
          const filteredExpenses = this.filterData(expenses); // 🔹 Filtrar primero
          const mappedExpenses = this.mapExpensesToChartData(filteredExpenses); // 🔹 Luego mapear
          this.updateChart(mappedExpenses, 'Gastos');
        });
      }
    }
  }

  
  filterData<T extends { saleDate?: string | Date; date?: string }>(data: T[]): T[] {
    return data.filter(item => {
      const itemDate = new Date(typeof item.saleDate === 'string' ? item.saleDate : item.saleDate || item.date!);
      itemDate.setHours(0, 0, 0, 0); // 🔹 Remover hora para comparación exacta
  
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;
  
      return (!start || itemDate >= start) && (!end || itemDate <= end);
    });
  }
  
  
  

  mapSalesToChartData(sales: Sale[]): { date: string; amount: number }[] {
    return sales.map(sale => ({
      date: new Date(sale.saleDate).toISOString().split('T')[0], // 🔹 Convertir fecha a YYYY-MM-DD
      amount: sale.totalAmount
    }));
  }
  
  
  
  

  updateChart(data: { date: string; amount: number }[], label: string) {
    const salesByDate: { [key: string]: number } = {};
  
    data.forEach(entry => {
      salesByDate[entry.date] = (salesByDate[entry.date] || 0) + entry.amount;
    });
  
    this.barChartLabels = Object.keys(salesByDate);
    this.barChartData = [{ data: Object.values(salesByDate), label }];
  }
  
  resetFilters() {
    this.startDate = null;
    this.endDate = null;
    this.selectedType = 'sales';
    this.applyFilters();
  }
  setDateRange(range: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 🔹 Eliminar la hora para comparar solo la fecha
  
    switch (range) {
      case 'today':
        this.startDate = new Date(today); // 🔹 Almacenar como `Date`
        this.endDate = new Date(today);
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        this.startDate = new Date(weekAgo);
        this.endDate = new Date(today);
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        this.startDate = new Date(monthAgo);
        this.endDate = new Date(today);
        break;
    }
    this.applyFilters();
  }
  
  
  downloadCSV() {
    let csvData = "Fecha,Monto\n";
    this.barChartLabels.forEach((label, index) => {
      csvData += `${label},${this.barChartData[0].data[index]}\n`;
    });
  
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'datos.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
downloadPDF() {
  const chartElement = document.querySelector('canvas') as HTMLCanvasElement;

  if (!chartElement) {
    alert("No hay datos en el gráfico para exportar.");
    return;
  }

  html2canvas(chartElement).then(canvas => {
    const chartImage = canvas.toDataURL('image/png');

    const tableBody = [
      ['Fecha', 'Monto'],
      ...this.barChartLabels.map((label, index) => [
        label,
        this.barChartData[0].data[index]
      ])
    ];

    const documentDefinition = {
      content: [
        { text: 'Reporte de Gráficos', style: 'header' },
        { text: `Fecha de generación: ${new Date().toLocaleDateString()}`, alignment: 'right' },
        { text: '\n' },
        { image: chartImage, width: 500 }, // 🔹 Inserta la imagen del gráfico
        { text: '\n' },
        { text: 'Datos del gráfico:', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: tableBody
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
      }
    };

    pdfMake.createPdf(documentDefinition).download('Grafico-Reporte.pdf');
  });
}
mapExpensesToChartData(expenses: Expense[]): { date: string; amount: number }[] {
  return expenses.map(expense => ({
    date: new Date(expense.date).toISOString().split('T')[0], // 🔹 Convertir fecha a YYYY-MM-DD
    amount: expense.amount
  }));
}


updateChartWithComparison(sales: { date: string; amount: number }[], expenses: { date: string; amount: number }[]) {
  const salesData: { [key: string]: number } = {};
  const expensesData: { [key: string]: number } = {};

  // 🔹 Agrupar ventas por fecha
  sales.forEach(entry => {
    salesData[entry.date] = (salesData[entry.date] || 0) + entry.amount;
  });

  // 🔹 Agrupar gastos por fecha
  expenses.forEach(entry => {
    expensesData[entry.date] = (expensesData[entry.date] || 0) + entry.amount;
  });

  // 🔹 Obtener todas las fechas únicas
  this.barChartLabels = Array.from(new Set([...Object.keys(salesData), ...Object.keys(expensesData)]));

  // 🔹 Asignar datos a las barras
  this.barChartData = [
    { data: this.barChartLabels.map(date => salesData[date] || 0), label: 'Ventas' },
    { data: this.barChartLabels.map(date => expensesData[date] || 0), label: 'Gastos' }
  ];

  console.log("📊 Fechas del gráfico:", this.barChartLabels);
  console.log("📊 Ventas:", salesData);
  console.log("📊 Gastos:", expensesData);
}


}
