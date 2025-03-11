import DefaultImage from "/image.png";
import Busao from "/busao.jpeg";
import Violao from "/violao.jpg";
import upa from "/upa.jpg";
import { Noticia } from "../@types/News"

const noticias: Noticia[] = [
  {
    id_noticia: 1,
    ds_conteudo: "A inteligência artificial está revolucionando diversos setores.",
    nm_titulo: "IA e o Futuro da Tecnologia ",
    ds_subtitulo: "Como a inteligência artificial está moldando o mundo.",
    dt_publicacao: "2024-03-09T10:00:00Z",
    dt_atualizacao: "2024-03-09T10:00:00Z",
    nm_img: DefaultImage,
    tags: [
      { id_tag : 1, nm_slug: "inteligencia-artificial", dt_cadastro: "2024-01-15T08:30:00Z" },
      { id_tag : 2, nm_slug: "tecnologia", dt_cadastro: "2024-01-10T12:00:00Z" }
    ]
  },
  {
    id_noticia: 2,
    ds_conteudo: "Estudos mostram que exercícios físicos aumentam a longevidade.",
    nm_titulo: "O Impacto dos Exercícios na Saúde",
    ds_subtitulo: "Descubra os benefícios de manter uma rotina ativa.",
    dt_publicacao: "2024-03-08T14:00:00Z",
    dt_atualizacao: "2024-03-08T14:00:00Z",
    nm_img: Busao,
    tags: [
      { id_tag : 3, nm_slug: "saude", dt_cadastro: "2024-02-01T09:45:00Z" },
      { id_tag : 4, nm_slug: "bem-estar", dt_cadastro: "2024-02-02T10:20:00Z" }
    ]
  },
  {
    id_noticia: 3,
    ds_conteudo: "Dicas essenciais para uma alimentação equilibrada e saudável.",
    nm_titulo: "Nutrição e Alimentação Saudável",
    ds_subtitulo: "Como sua dieta pode impactar sua qualidade de vida.",
    dt_publicacao: "2024-03-07T09:30:00Z",
    dt_atualizacao: "2024-03-07T09:30:00Z",
    nm_img: Violao,
    tags: [
      { id_tag : 5, nm_slug: "nutricao", dt_cadastro: "2024-02-10T11:00:00Z" },
      { id_tag : 6, nm_slug: "saude", dt_cadastro: "2024-02-15T15:30:00Z" }
    ]
  },
  {
    id_noticia: 4,
    ds_conteudo: "O mercado financeiro apresenta novas tendências para investidores.",
    nm_titulo: "Investimentos em 2024",
    ds_subtitulo: "Onde investir seu dinheiro este ano?",
    dt_publicacao: "2024-03-06T18:45:00Z",
    dt_atualizacao: "2024-03-06T18:45:00Z",
    nm_img: upa,
    tags: [
      { id_tag : 7, nm_slug: "economia", dt_cadastro: "2024-02-05T14:00:00Z" },
      { id_tag : 8, nm_slug: "financas", dt_cadastro: "2024-02-07T16:20:00Z" }
    ]
  },
  {
    id_noticia: 5,
    ds_conteudo: "A nova tendência na moda sustentável está conquistando o mercado.",
    nm_titulo: "Moda Sustentável: O Futuro do Vestuário",
    ds_subtitulo: "Como as marcas estão investindo em materiais ecológicos.",
    dt_publicacao: "2024-03-05T12:15:00Z",
    dt_atualizacao: "2024-03-05T12:15:00Z",
    nm_img: Busao,
    tags: [
      { id_tag : 9, nm_slug: "moda", dt_cadastro: "2024-01-20T09:00:00Z" },
      { id_tag : 10, nm_slug: "sustentabilidade", dt_cadastro: "2024-01-22T10:45:00Z" }
    ]
  },
  {
    id_noticia: 6,
    ds_conteudo: "O mercado de criptomoedas continua a crescer com novas inovações.",
    nm_titulo: "Criptomoedas em Alta",
    ds_subtitulo: "O que esperar do mercado cripto nos próximos anos?",
    dt_publicacao: "2024-03-04T17:00:00Z",
    dt_atualizacao: "2024-03-04T17:00:00Z",
    nm_img: Violao,
    tags: [
      { id_tag : 1, nm_slug: "blockchain", dt_cadastro: "2024-02-12T14:30:00Z" },
      { id_tag : 1, nm_slug: "criptomoedas", dt_cadastro: "2024-02-15T15:00:00Z" }
    ]
  },
  {
    id_noticia: 7,
    ds_conteudo: "Estudos mostram os benefícios da leitura para o cérebro.",
    nm_titulo: "O Poder da Leitura",
    ds_subtitulo: "Por que ler pode melhorar sua vida?",
    dt_publicacao: "2024-03-03T09:50:00Z",
    dt_atualizacao: "2024-03-03T09:50:00Z",
    nm_img: upa,
    tags: [
      { id_tag : 1, nm_slug: "educacao", dt_cadastro: "2024-01-25T10:30:00Z" },
      { id_tag : 1, nm_slug: "desenvolvimento-pessoal", dt_cadastro: "2024-01-27T12:10:00Z" }
    ]
  },
  {
    id_noticia: 8,
    ds_conteudo: "O turismo sustentável está ganhando força entre viajantes.",
    nm_titulo: "Viagens Sustentáveis",
    ds_subtitulo: "Como viajar sem prejudicar o meio ambiente.",
    dt_publicacao: "2024-03-02T11:30:00Z",
    dt_atualizacao: "2024-03-02T11:30:00Z",
    nm_img: Busao,
    tags: [
      { id_tag : 1, nm_slug: "turismo", dt_cadastro: "2024-02-03T08:40:00Z" },
      { id_tag : 1, nm_slug: "sustentabilidade", dt_cadastro: "2024-02-05T09:50:00Z" }
    ]
  },
  {
    id_noticia: 9,
    ds_conteudo: "A importância da programação no mundo moderno.",
    nm_titulo: "Programação: A Habilidade do Futuro",
    ds_subtitulo: "Por que aprender a programar é essencial?",
    dt_publicacao: "2024-03-01T15:00:00Z",
    dt_atualizacao: "2024-03-01T15:00:00Z",
    nm_img: DefaultImage,
    tags: [
      { id_tag : 1, nm_slug: "tecnologia", dt_cadastro: "2024-01-30T14:20:00Z" },
      { id_tag : 1, nm_slug: "programacao", dt_cadastro: "2024-02-01T16:10:00Z" }
    ]
  },
  {
    id_noticia: 10,
    ds_conteudo: "O que esperar das mudanças climáticas nos próximos anos.",
    nm_titulo: "Mudanças Climáticas e Seus Impactos",
    ds_subtitulo: "Como podemos nos preparar para o futuro?",
    dt_publicacao: "2024-02-28T13:20:00Z",
    dt_atualizacao: "2024-02-28T13:20:00Z",
    nm_img: upa,
    tags: [
      { id_tag : 1, nm_slug: "meio-ambiente", dt_cadastro: "2024-02-07T10:15:00Z" },
      { id_tag : 1, nm_slug: "sustentabilidade", dt_cadastro: "2024-02-09T11:30:00Z" }
    ]
  }
];

export default noticias;
