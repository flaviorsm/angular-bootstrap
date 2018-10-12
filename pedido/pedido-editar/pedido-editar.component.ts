import { PrecoService } from './../../../services/preco.service';
import { Component, OnInit } from '@angular/core';
import { PedidoService } from './../../../services/pedido.service';
import { Pedido } from './../../../models/pedido.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { Status } from '../../../enum/status.enum';
import { Preco } from '../../../models/preco.model';

@Component({
  selector: 'app-pedido-editar',
  templateUrl: './pedido-editar.component.html',
  styleUrls: ['./pedido-editar.component.css']
})
export class PedidoEditarComponent implements OnInit {

  pedido: Pedido;
  cliente: Cliente;
  preco: Preco;

  pedidoForm: FormGroup;
  titulo: string;
  isEditable: boolean;
  status: Status;
  codigoPedido: String;

  precos: Preco[] = [];
  private idPedido = '';
  private idCliente = '';

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private precoService: PrecoService,
    private pedidoService: PedidoService, private router: Router) { }

  ngOnInit() {
    this.clearForm();
    this.createForm();
    this.isEditable = Boolean(localStorage.getItem("isEditable"));
    if (this.isEditable) {
      this.idPedido = localStorage.getItem("idPedido");
      this.titulo = "Alterar";
      this.pedidoService.getById(this.idPedido)
        .then((data) => {
          this.codigoPedido = data.codPedido.toString();
          this.pedidoForm = this.fb.group({
            id: [data.id],
            nome: [data.cliente.nome],
            telefone: [],
            endereco: [data.cliente.endereco],
            email: [data.cliente.email],
            valor: [data.preco.id],
            descricao: [data.descricao]
          });
          this.pedido = data;
          this.cliente = data.cliente;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.gerarCodigo();
    }
  }

  createForm() {
    this.pedidoForm = this.fb.group({
      id: [],
      telefone: ['', Validators.minLength(9)],
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      valor: ['', Validators.required],
      descricao: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  clearForm() {
    this.titulo = "Adicionar";
    this.isEditable = false;

    this.pedido = new Pedido();
    this.pedido.id = null;
    this.pedido.clienteId = null;
    this.pedido.descricao = '';
    this.pedido.codPedido = null;
    this.pedido.data = null;

    this.cliente = new Cliente();
    this.cliente.telefone = '';
    this.cliente.nome = '';
    this.cliente.endereco = '';
    this.cliente.email = '';

    this.preco = new Preco();
    this.preco.id = null;
    this.preco.preco = 0;
    this.preco.tamanho = '';

    this.precoService.getAll().then((data) => { this.precos = data; });
  }

  onSubmit(form: any) {
    this.fazerPedido(form);
  }

  fazerPedido(form: any) {
    this.cliente.telefone = form.telefone;
    this.cliente.nome = form.nome;
    this.cliente.endereco = form.endereco;
    this.cliente.email = form.email;
    if (this.idPedido == '') {
      this.clienteService.save(this.cliente).then((data: any) => {
        this.salvarPedido(data.id, form);
      });
    } else {
      this.clienteService.update(this.cliente.id, this.cliente).then(() => {
        this.salvarPedido(this.cliente.id, form);
      });
    }
  }

  salvarPedido(clienteId: string, form: any): void {
    let pedido = new Pedido();
    pedido.descricao = form.descricao;
    pedido.codPedido = Number(this.codigoPedido);
    pedido.clienteId = clienteId;
    pedido.precoId = form.valor;
    if (this.idPedido == '') {
      pedido.status = 0;
      pedido.data = new Date().toLocaleDateString();
      this.pedidoService.save(pedido).then(() => {
        this.router.navigate(['pedido-listar/1']);
      }).catch((err: any) => {
        console.error(err.message);
      });
    } else {
      pedido.status = this.pedido.status;
      pedido.data = this.pedido.data;
      this.pedidoService.update(this.pedido.id, pedido).then(() => {
        this.router.navigate(['pedido-listar/1']);
      }).catch((err: any) => {
        console.error(err.message);
      });
    }
  }

  gerarCodigo() {
    let date = new Date();
    let dia = this.leftPad(date.getDate().toString(), 2);
    let mes = this.leftPad((date.getMonth() + 1).toString(), 2);
    let cod = this.leftPad((Math.floor(Math.random() * 1000)).toString(), 3);    
    this.codigoPedido = mes + dia + cod;
  }

  leftPad(value: string, totalWidth: number): string {
    let length = totalWidth - value.toString().length + 1;
    return Array(length).join('0') + value;
  }
}
