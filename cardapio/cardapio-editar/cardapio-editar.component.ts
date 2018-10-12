import { Cardapio } from './../../../models/cardapio.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardapioService } from '../../../services/cardapio.service';

@Component({
  selector: 'app-cardapio-editar',
  templateUrl: './cardapio-editar.component.html',
  styleUrls: ['./cardapio-editar.component.css']
})
export class CardapioEditarComponent implements OnInit {

  cardapio: Cardapio;
  cardapioForm: FormGroup;
  titulo: string;
  isEditable: boolean;

  constructor(private fb: FormBuilder, private cardapioService: CardapioService, 
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.clearForm();
    this.isEditable = Boolean(localStorage.getItem("isEditable"));
    if(this.isEditable) {
      let itemId = localStorage.getItem("itemId");
      this.titulo = "Alterar";
      this.cardapioService.getById(itemId)
        .then((data) => {          
          this.cardapioForm.setValue(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  createForm() {
    this.cardapioForm = this.fb.group({
      id          : [],
      nome        : ['', Validators.required],
      ingredientes: ['', Validators.required],
      ativo       : ['', Validators.nullValidator],
    });
  }

  clearForm() {
    this.cardapio = new Cardapio();
    this.cardapio.id = '';
    this.cardapio.nome = '';
    this.cardapio.ingredientes = '';
    this.cardapio.ativo = true;
    this.cardapioForm.setValue(this.cardapio);
    this.titulo = "Adicionar";
    this.isEditable = false;
  }

  onSubmit(item: Cardapio) {
    if(item.id == '') {
      this.cardapioService.save(item).then(() => {
        this.router.navigate(['cardapio-listar']);
      })
      .catch((error) => {
        console.error(error.message);
      });
    } else {
      this.cardapioService.update(item.id, item).then(() => {
        this.router.navigate(['cardapio-listar']);
      })
      .catch((error) => {
        console.error(error.message);
      });
    }    
  }

}
