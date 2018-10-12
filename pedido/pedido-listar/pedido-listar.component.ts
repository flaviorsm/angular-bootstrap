import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../models/pedido.model';
import { PedidoService } from '../../../services/pedido.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Status } from '../../../enum/status.enum';
import { Local } from '../../../enum/local.enum';

@Component({
  selector: 'app-pedido-listar',
  templateUrl: './pedido-listar.component.html',
  styleUrls: ['./pedido-listar.component.css']
})
export class PedidoListarComponent implements OnInit {

  pedidos: Pedido[] = [];
  form: any = [];
  statusValue: Status;
  cozinha: boolean;
  localId: number;

  constructor(private pedidoService: PedidoService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    localStorage.removeItem("idPedido");
    localStorage.removeItem("isEditable");
    this.localId = Number(this.activeRoute.snapshot.paramMap.get('local'));
    this.listarPedidos();
  }

  listarPedidos() {
    let dataAtual = new Date();
    let dataAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() - 1);
    if (this.localId == 0) {
      this.pedidoService.getByStatus(0).then((data) => {
        this.pedidos = data;
      });
    } else {
      this.pedidoService.getByDate(dataAnterior.toLocaleDateString()).then((data) => {
        this.pedidos = data;
      });
    }
  }

  deletarPedido(pedido: Pedido) {
    this.pedidoService.remove(pedido.id).then(() => {
      this.listarPedidos();
    });
  }

  alterarStatus(pedido: Pedido) {
    let statusNovo = pedido.status + 1;
    this.pedidoService.updateStatus(pedido.id, statusNovo).then(() => {
      this.listarPedidos();
    });
  }

  editarPedido(pedido: Pedido) {
    localStorage.setItem("idPedido", pedido.id);
    localStorage.setItem("isEditable", "true");
    this.router.navigate(['/pedido-editar']);
  }

  adicionarPedido(pedido: Pedido) {
    this.router.navigate(['/pedido-editar']);
  }

}
