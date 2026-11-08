# Fernanda Tahara — versão 2

Execute `npm run dev` nesta pasta e abra http://localhost:4173. HTML, CSS e JavaScript, sem dependências Node. Google Fonts tem fontes locais de fallback.

Direção visual: composição fotográfica, paleta mineral, tipografia condensada e serifada, cortes diagonais. Inspiração de escala e personalidade: https://www.worksruthi.com/. Não usa imagens, textos ou código da referência. A foto do sobre é a original enviada. Prints do portfólio e o recorte por IA da versão 1 não são usados.

## Filmes
- filme-01.mp4: WhatsApp 19.56.20 — aniversário, 48,9 segundos.
- filme-02.mp4: WhatsApp 19.56.22 — beleza, 17,97 segundos.
- filme-03.mp4: WhatsApp 20.00.26 — batizado, 57,33 segundos.
- filme-04.mp4: WhatsApp 20.02.09 — homenagem, 98,33 segundos.

Cópias integrais dos quatro arquivos enviados. Capas extraídas dos próprios vídeos por FFmpeg. hero-film-v2.mp4 é um trecho otimizado de 2,4 segundos sem áudio do segundo filme. Títulos dos cards são editoriais.

As prévias silenciosas só reproduzem quando visíveis e podem ser pausadas. O player completo tem áudio, controles nativos e tela cheia. As prévias param durante a exibição do filme; o vídeo completo para ao fechar. O servidor tem suporte a HTTP Range (206) para busca no vídeo e Safari/iOS.

Scroll usa requestAnimationFrame e IntersectionObserver. Movimento reduzido desliga parallax e autoplay. A escala no fundo é um efeito visual e não uma filmagem com vertigo óptico real.

Depoimentos transcritos dos prints sem nomes de clientes. Valores, prazos e collabs são combinados em conversa. Nenhuma publicação externa realizada. Contatos profissionais mantidos dos materiais enviados.



## Marca e contato (versão 3)
O monograma ft foi substituído por um leque vetorial próprio, criado em SVG. O símbolo aparece somente no cabeçalho, na divisória do manifesto e no contato. A logo original enviada está preservada em assets/tahara-films-logo.png e aplicada na seção sobre. Numerações decorativas foram retiradas.
O fechamento usa uma fonte manuscrita (Mrs Saint Delafield), como recurso tipográfico e não como rubrica real. Instagram @TAHARAFILMS, WhatsApp e telefone seguem os contatos enviados. O botão de e-mail copia fernandalmeida18@gmail.com e informa o resultado em uma região acessível. Usa Clipboard API com fallback para navegadores antigos. A referência de composição é https://jozue.fr/, sem copiar seus arquivos ou sua assinatura.

Refino do contato: assinatura apenas Tahara, mais espessa e com contraste reduzido. Sem handle duplicado, instrução visível de copiar ou parágrafo de condições no fechamento. O e-mail mantém cópia por clique, status para leitores de tela e animação de texto em subida com preenchimento branco no hover e foco por teclado. Preferência de movimento reduzido respeitada.

## Paleta e escala mobile (versão 5)
Verdes substituídos por vinho, vermelho e neutros rosados; fundos bege e palha preservados. A assinatura Tahara foi reduzida para caber integralmente em desktop e mobile. A abertura recebeu a faixa Explore meus filmes, com 68px no celular e seta em movimento suave. Textos principais, controles de vídeo, descrições e áreas de toque foram ampliados no mobile. A faixa leva diretamente aos filmes. Movimento reduzido desativa a animação da seta.

## Refinos de movimento e abertura (versão 6)
Abertura sem o slogan, a descrição, o marcador Em cena/Beleza e a frase de rodapé. A faixa inteira oscila em 4px; sua frase sai por cima e reaparece por baixo em um ciclo separado, tanto no desktop quanto no celular. A seção imediatamente seguinte usa o mesmo vermelho da faixa. Telefone agora é um botão de copiar +5592984076742, com check de confirmação; o e-mail mantém sua interação. Ambos usam a mesma função de cópia e status acessível.

## Suavização e retenção (versão 7)
A superfície vermelha oscila apenas 3px em 3,2 segundos. A altura do botão e a linha da frase permanecem fixas; só o ciclo de saída/entrada move a frase. A camada clara do hover foi retirada, mantendo a cor idêntica ao manifesto. Retenção com position:sticky aplicada às demais seções, com centralização nas seções curtas e retenção após a leitura completa nas longas. Nenhum evento de roda/toque é bloqueado; âncoras internas foram ajustadas e preferência de movimento reduzido desativa a retenção adicional.

## Ritmo medido da referência (versão 8)
Ciclo da seta e da superfície: 1,8s, deslocamento de 4px, curva cubic-bezier(.4,0,.2,1). Frase: ciclo de 6s, atraso inicial de 2,48s, saída entre 84% e 90%, reaparição de baixo entre 90,01% e 100%, com curvas distintas de saída e entrada. Mesmos valores no desktop e no mobile. A seta usa SVG para evitar a rotação de uma borda durante a translação.

## Cabeçalho, legibilidade e viewport (atualização atual)
No desktop, a abertura agora mede a altura disponível da janela sem mínimo de 720px. Isso mantém faixa, frase e seta na primeira tela. Identificação Videomaker & Criadora Visual centralizada verticalmente no cabeçalho, com adaptação ao mobile. Controle de pausa da abertura removido junto com seus handlers, preservando a reprodução e as preferências de movimento reduzido. Textos auxiliares do manifesto vermelho ampliados. Setinha SVG com ciclo independente de 1,8s e deslocamento de 6px.
Harmony: aguarda arquivo com licença web, conforme FONTES.md. Nenhuma fonte de uso pessoal incorporada nem compra realizada. A linha narrativa e a seção sobre edição humana não foram implementadas, conforme solicitado. Validação desta atualização: sintaxe JavaScript e HTTP dos arquivos; inspeção visual indisponível após interrupção do controle de navegador.

## Vermelho e tipografia publicados
Vermelho principal #FE0B00, extraído da variável --e-global-color-primary da referência https://pontofuba.com/en/. A faixa e o manifesto compartilham esse mesmo valor. Os fundos claros foram preservados; as sombras vermelhas passaram para tons mais quentes. Fonte editorial Bodoni Moda, hospedada localmente com licença OFL, como alternativa à Harmony. Detalhes em FONTES.md. A fonte manuscrita da assinatura foi preservada.

## Nome e feedbacks
No desktop, nome empilhado na área vermelha: FERNANDA em Bebas Neue e Tahara em assinatura tipográfica. A composição do nome no mobile permanece intacta. A antiga seção de serviços Cada história, um caminho foi substituída por um carrossel de seis feedbacks reais, com controles, toque e arraste por mouse, sem autoplay. Cada cartão abre o print original em um diálogo. A seção antiga de depoimentos foi removida para evitar duplicação. Os arquivos originais estão em assets/feedbacks/.

## Sequência de filmes no desktop
A partir de 701px, os quatro trabalhos passam a ocupar cenas individuais com texto e vídeo em lados alternados. A descrição entra primeiro; o vídeo vertical sobe com o scroll e permanece em cena antes do próximo trabalho. Largura limitada a 340px e altura proporcional à janela. Movimento reduzido apresenta as cenas sem animação nem retenção extra. No mobile, os cards e o nome da abertura preservam sua composição anterior. No desktop, FERNANDA foi ampliado e Tahara começa próximo ao meio do nome, avançando sobre o vídeo.

## Sobre e polaroides
Rodapé dos filmes e controle de pausa das prévias removidos. Por trás do olhar ganhou título principal e entrada vinculada ao scroll, primeiro da foto e depois do texto; logo centralizada na coluna. Abaixo de 701px, o nome usa Bebas Neue e Mrs Saint Delafield preservando as regras de posicionamento. Feedbacks destacam o print integral antes da frase, em polaroides com movimento contínuo da esquerda para a direita. O movimento pausa no hover, foco, abertura da mensagem, fora da tela e pelo controle de pausa; movimento reduzido mantém a faixa estática com rolagem manual.

## Continuidade da abertura e refinamentos
A área de retenção da abertura usa o mesmo vermelho da faixa e do manifesto, sem centralizar verticalmente a abertura dentro da retenção. Isso evita a faixa clara na passagem entre as seções, inclusive com alturas de viewport diferentes no Safari. Me conta a sua ideia centralizado na coluna, legenda dos feedbacks com mais contraste e carrossel sem pausa por hover. Pausa explícita, foco, diálogo e movimento reduzido continuam disponíveis.

## Ajuste atual — prévia local
Linha narrativa completamente removida do HTML, CSS e JavaScript, incluindo corações, marcadores e callbacks de scroll. Mantida a rolagem natural da abertura e do manifesto. Textos/controles visuais Assistir ao filme removidos dos quatro vídeos e das descrições. Cada vídeo permanece como botão acessível e abre o player completo ao clique ou pelo teclado. Fontes locais e pré-carregamento preservados. Sem deploy.
