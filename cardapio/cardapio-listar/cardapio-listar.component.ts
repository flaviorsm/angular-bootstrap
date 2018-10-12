import { Cardapio } from './../../../models/cardapio.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CardapioService } from '../../../services/cardapio.service';

@Component({
  selector: 'app-cardapio-listar',
  templateUrl: './cardapio-listar.component.html',
  styleUrls: ['./cardapio-listar.component.css']
})
export class CardapioListarComponent implements OnInit {

  itens: any = [];
  
  constructor(private cardapioService: CardapioService, private router: Router) { }

  ngOnInit() {
    localStorage.removeItem("itemId");
    localStorage.removeItem("isEditable");
    this.listaItens();
  }

  listaItens() {
    this.cardapioService.getAll()
      .then((data) => {
        this.itens = data; 
      });
  }

  deletarItem(item: Cardapio) {
    this.cardapioService.remove(item.id).then(() => {
      this.listaItens();
    });  
  }

  editarItem(item: Cardapio) {
    localStorage.setItem("itemId", item.id);
    localStorage.setItem("isEditable", "true");
    this.router.navigate(['/cardapio-editar']);
  }

  adicionarItem(item: Cardapio) {    
    this.router.navigate(['/cardapio-editar']);
  }
}
