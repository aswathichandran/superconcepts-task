import { Component, OnInit, Inject } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  genre: number;
  price: number;
  actions: any;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'delete',
  templateUrl: './delete.html',
  styleUrls: ['./dashboard.component.css'],
})

export class Delete {

  constructor(public dialogRef: MatDialogRef<Delete>, private db: DashboardService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data:any) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Delete Book Details with Id
  delete() {
    this.db.delete(this.data.id).subscribe((res: any) => {
      this.snackBar.open("Selected Book Details Deleted", "close", {
        duration: 500,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      })
      this.dialogRef.close();
    })

  }

}

@Component({
  selector: 'update',
  templateUrl: './update.html',
  styleUrls: ['./dashboard.component.css'],
})

export class Update {
  updateForm:  FormGroup;
  constructor(public dialogRef: MatDialogRef<Update>, private _formBuilder: FormBuilder, private db: DashboardService, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data:any) {
    this.updateForm = this._formBuilder.group({
      name: ['', Validators.required],
      genre: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getBookinfo();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Ger Book Details with Id
  getBookinfo(){
    this.db.getBookInfo(this.data.id).subscribe((res:any) => {
      this.updateForm.patchValue({
        name: res.name,
        genre: res.genre,
        price: res.price
      })
    })
  }

  // Update Book Details
  update() {
    this.db.updatebookinfo(this.updateForm.value, this.data.id).subscribe((res:any) => {
      this._snackBar.open("Book Details Updated", 'close', {
        duration:500,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      })
      this.dialogRef.close();
    })

  }

}

@Component({
  selector: 'add',
  templateUrl: './add.html',
  styleUrls: ['./dashboard.component.css'],
})

export class Add {
  addNewForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<Add>, private _formBuilder: FormBuilder, private db: DashboardService, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data:any) {
    this.addNewForm = this._formBuilder.group({
      name: ['', Validators.required],
      genre: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Add New Book Details
  add() {
    this.db.addBooks(this.addNewForm.value).subscribe((res:any) => {
      if(res){
        this._snackBar.open("New Book Details Added", "close", {
          duration:500,
          verticalPosition:'top',
          horizontalPosition: 'right'
        })
        this.dialogRef.close();
      }
    })
  }

}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['name', 'genre', 'price', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  searchdata:any;


  constructor(private db: DashboardService, public dialog: MatDialog ) { }

  ngOnInit(): void {
    this.getBooksInfo();
  }


  // // Apply Filter
  applyFilter(event: Event) {
    let val = (event.target as HTMLInputElement).value;
    if(val.length >= 2){
      this.dataSource = this.searchdata.filter(function (el: any) { 
        return el.name.toLowerCase().indexOf(val)  >= 0 || el.genre.toLowerCase().indexOf(val)  >= 0 || el.price.indexOf(val)  >= 0 ; 
      });
    }else if(val.length == 0){
      this.dataSource = this.searchdata
    }
    
  }


  // Get All Book Details
  getBooksInfo(){
    this.db.getBooksInfo().subscribe((res:any) => {
      this.dataSource = res;
      this.searchdata = res;
    })
  }

  //Fetch Id and Open Delete Dialog 
  delete(id:any){
    const dialogRef = this.dialog.open(Delete, {
      width:'300px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.getBooksInfo();
    })
  }

  // Fetch id and Open Update Dialog
  update(id:any){
    const dialogRef = this.dialog.open(Update, {
      width:'500px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.getBooksInfo();
    })
  }

  // Open Add Dialog
  add(){
    const dialogRef = this.dialog.open(Add, {
      width:'500px'
    });
    dialogRef.afterClosed().subscribe(result => {
        this.getBooksInfo();
    })
  }

}
