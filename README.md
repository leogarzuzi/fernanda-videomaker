# Fernanda Tahara — versão 2

## Área administrativa

Com Node.js 22.9 ou superior, execute na pasta do projeto:

```powershell
npm.cmd ci
npm.cmd run setup-admin
npm.cmd run dev
```

Abra http://localhost:4173/admin. O comando de configuração gera uma senha e exibe as credenciais no terminal na primeira execução. Elas ficam no arquivo `.env` local e são lidas a cada tentativa de acesso. O site e o painel usam o mesmo servidor. Com `npm.cmd run dev`, as mudanças de código do servidor são recarregadas automaticamente. Para conferir alterações visuais, atualize a página.

O painel edita a abertura, os quatro filmes, a biografia, os cartões de feedback e os contatos. Cada seção tem uma imagem fixa de referência. É possível adicionar e remover cartões, até o limite de 24. A seção de feedback fica oculta no portfólio quando não há cartões. O botão **Salvar alterações** aplica as mudanças. O painel aceita vídeos MP4 de até 150 MB e imagens JPG, PNG ou WebP de até 8 MB. Na versão local, os dados e uploads ficam em `.portfolio-data/`.

### Hospedagem na Vercel

Conecte um armazenamento **Vercel Blob público** ao projeto para disponibilizar `BLOB_READ_WRITE_TOKEN`. Configure `ADMIN_USER` e `ADMIN_PASSWORD` nas variáveis do ambiente da Vercel. Use uma senha aleatória de pelo menos 16 caracteres e credenciais próprias para produção. Faça um novo deploy e acesse `/admin` pelo domínio publicado. Os uploads e as edições feitas no painel publicado ficam no Blob e são independentes dos arquivos de desenvolvimento local. Para separar edições de teste e produção, use armazenamentos diferentes por ambiente.

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

## Vídeo atualizado na abertura
O hero usa hero-film-enhanced.mp4: os 18 segundos completos da versão tratada em 1080 × 1920, otimizada em H.264 e sem áudio. A capa hero-film-enhanced-poster.jpg vem da mesma versão. Reprodução em loop, pausa fora da tela e preferência de movimento reduzido preservadas.

## Conversão, cinema e navegação
Seção de filmes em fundo escuro, mantendo os quatro vídeos clicáveis. Diálogos de filme e mensagens com entrada/saída suaves, fechamento por Escape, fundo ou botão, foco restaurado sem deslocar a página e respeito a movimento reduzido. Novos blocos O diferencial do mobile (agilidade, vertical nativo e presença discreta) e Como eu trabalho (marcas, coberturas sociais e beleza/lifestyle). Prazo combinado sem promessa fixa; collabs indicadas no bloco de serviços. Menu mobile em tela inteira, foco contido, conteúdo de fundo inerte, áreas de toque de 44px e fechamento ao navegar/mudar para desktop. WhatsApp fixo com safe-area: ícone compacto sobre a abertura para preservar Explore, texto visível nas outras seções no mobile e controle discreto no desktop. Oculto em menus e diálogos. Scrollbars em tons do site. Sintaxe/build, estrutura/âncoras, estados dos diálogos e foco do menu verificados; sem publicação.

## Apresentação fotográfica da Fernanda
Sobre redesenhado como composição editorial: recorte da foto nova centralizado sobre creme, Oiiiie, Conheça a e FERNANDA em português, com pequenos desenhos vetoriais estáticos de celular, estrelas e leque. Recorte gerado a partir da foto enviada, salvo com transparência real em assets/fernanda-recorte-v2.png. Textos e desenhos permanecem em HTML/SVG/CSS, sem colchetes de programação nem texto incorporado ao PNG. Mobile reorganiza as palavras ao redor da foto e mantém FERNANDA na base. Biografia preservada abaixo; link e marca centralizados. Seção em fluxo natural, com entrada discreta da foto/texto e movimento reduzido respeitado. Sem deploy.

## Aproximação da composição
Oiiie em Manrope com caixa preservada para distinguir os i; nome FERNANDA ampliado. Saudação, Conheça a e ondas posicionados em relação à largura do recorte, com sobreposição dos traços nas laterais do corpo. Celular e estrelas removidos; leque preservado. Retenção breve aplicada a todas as seções exceto o Sobre, que continua em fluxo natural. Hover do WhatsApp desktop com expansão mais suave, leve elevação e inclinação do ícone; movimento reduzido respeitado. Sem deploy.

## Duas fotos em continuidade
Segundo recorte transparente da foto de camiseta branca em assets/fernanda-recorte-invertido-v1.png. Apresentado a 180 graus abaixo do primeiro, com largura calculada para aproximar os recortes de roupa. As duas composições compartilham uma elevação adicional ligada ao scroll, mantendo a emenda durante o movimento. Nova frase Vai ser / um prazer / trabalhar com você e ondas em volta do segundo retrato. Sobre continua sem retenção. Nos filmes desktop, cena ampliada de 175svh para 230svh; subida distribuída por 82% do percurso e curva smoothstep em lugar da aceleração inicial cúbica. Mobile mantém os cards de filmes existentes. Redução de movimento mantém os retratos estáticos e a inversão intencional. Validados estrutura, transparência, sintaxe/build e redução do deslocamento para a mesma distância de scroll. Sem deploy.

## Retorno à foto única
Segunda foto invertida e movimento compartilhado removidos da página. Mantida a subida mais lenta dos vídeos. Ondas do retrato substituídas por pinceladas vetoriais translúcidas, com textura e espessuras diferentes, sem animação narrativa. Saudação oiiie em caixa baixa; legenda Criadora de vídeos e histórias em preto; FERNANDA deslocado para a esquerda, com sobreposição maior no recorte e ajuste próprio no mobile. Sem deploy.

## Estudo de mangá e sakura
Ondas removidas para testar cinco pétalas de sakura e dois pequenos conjuntos de traços de mangá, todos vetoriais, com leque preservado. Legenda preta agrupada ao nome em um mesmo bloco para manter o alinhamento central no desktop e mobile. oiiie mais próximo da foto; Conheça a em Bodoni Moda itálico no lugar da fonte manuscrita usada também no antigo um prazer. Foto única, corpo e rosto preservados. Sem deploy.

## Contorno de nanquim
Riscos de mangá removidos. Contorno decorativo em assets/fernanda-contorno-nanquim.svg, derivado da borda de transparência do recorte original, com seis pinceladas interrompidas e variação de pressão. Sobreposição usa o mesmo quadro e o mesmo movimento da foto. Pétalas mantidas. Legenda preta alinhada sobre a parte final do nome, à direita, em vez do centro da palavra inteira. Leque centralizado no fechamento da seção. Sem deploy.

## Legenda rente e nanquim reforçado
Legenda aproximada do nome, alinhada à direita e com ajuste óptico para terminar no último A. Contorno em fernanda-contorno-nanquim-v2.svg com onze pinceladas mais fortes, incluindo trechos adicionais de cabelo, cintura e roupa. Foto original do Sobre preservada; testes de metade mangá não foram aplicados ao site. Sem deploy.

## Carrossel com arraste
Posição compartilhada entre autoplay e arraste por Pointer Events no desktop e mobile. Segurar pausa; arrastar controla diretamente os prints e soltar aplica uma desaceleração breve antes de retomar o movimento automático. Toque/clique curto abre o original; arraste ou pressão longa bloqueiam o clique acidental. Gesto vertical continua rolando a página. Direção automática da esquerda para a direita preservada, sem pausa por hover; controle de pausa, foco por teclado, setas, movimento reduzido e suspensão fora da tela mantidos. Estados de interação verificados com teste local. Sem deploy.

## Mais movimento nos blocos editoriais
Serviços reformulados em três filmes com loops silenciosos leves (seis segundos cada), títulos curtos e uma frase por categoria; deslize horizontal no mobile. Novo título Qual história vem agora. Manifesto preserva a frase e recebe dois pequenos recortes de eventos nas laterais, com parallax discreto e centro livre para leitura. Novos vídeos usam o mesmo controle de visibilidade, pausa durante os diálogos e movimento reduzido. Removido Antes da câmera, a curiosidade; biografia aproximada da composição. Legenda do nome alinhada pela borda real dos glifos via Canvas e reavaliada no carregamento das fontes/resize. Player de filme entra com aproximação visível (escala .86 a 1 em 500ms) e fundo sincronizado, com saída de 280ms; mensagens mantêm a transição anterior. Validados codificação dos loops, markup, alinhamento estável em quatro larguras e estados dos modais. Sem deploy.

## Remoções e referência em caixa alta
Vídeos decorativos do manifesto removidos. Seção Qual história vem agora removida por inteiro, com links de menu retirados e CTA do benefício mobile redirecionado ao contato. Composição do Sobre usa HELLO / MEET / FERNANDA na mesma fonte Anton, em caixa alta, preservando o recorte, as pétalas, o nanquim e a legenda preta. Mobile adaptado para manter as palavras dentro da tela. Sem deploy.

## Menu em tela cheia (local, após publicação 8aaa5aa)
Versão anterior publicada antes da alteração do menu, conforme solicitado. Menu disponível no desktop e mobile: revelação circular a partir do botão, com pulsação inicial e duração de 1,4 segundo; opções entram após 0,8 segundo em sequência de 0,1 segundo. Letras rolam individualmente no hover e foco, com duração de 1 segundo e escalonamento de 0,05 segundo. Ritmo conferido na implementação pública de https://www.worksruthi.com/. Código adaptado em JavaScript nativo, sem dependências. Ilustração fornecida pelo usuário em assets/fernanda-menu-nanquim.png, exibida no desktop e paisagem; oculta no celular em retrato. Fechamento circular, Escape, foco contido, navegação após a saída e movimento reduzido. Novas alterações somente locais; sem segundo deploy. Validação por simulação de estado em quatro tamanhos, sintaxe, build e HTTP; sem inspeção visual em navegador nesta atualização.


## Publicação autorizada — menu e destaque SENTIR
Menu circular disponível no desktop e mobile, com entrada escalonada, animação das letras e ilustração de nanquim invertida para traços brancos. Rodapé do contato reposicionado. Destaque SENTIR usa a fonte Amanojaku fornecida pelo usuário, em maiúsculas e amarelo, sobre o papel rasgado realista. Incluídos apenas os novos arquivos usados pela versão atual e o original da fonte fornecida; experiências descartadas permanecem locais. Publicação solicitada pelo usuário após validação de sintaxe, build, links e assets, simulações do menu em quatro tamanhos, diálogos e carrossel.


## Fechamento: fluxo contínuo, rodapé e hero mobile
Retirada a criação de wrappers sticky entre seções e a distância extra de retenção. Seções seguem fluxo nativo; âncoras calculadas diretamente sobre a seção. No desktop, cartões de filmes usam cenas de uma tela sem retenção: descrição entra primeiro, vídeo começa quando o cartão chega a 64% da altura da janela e termina perto do topo, com posição e opacidade vinculadas diretamente ao scroll e reversíveis. Mobile mantém a organização dos cartões.

WhatsApp permanece fixo até se aproximar do rodapé e então sobe exatamente o necessário para manter 12px de separação da divisória, sem cobrir a seta. Atualização em scroll, resize, viewport visual e alterações no tamanho do conteúdo.

Hero: adicionado autoplay, muted, playsinline e webkit-playsinline; estado muted definido também em JavaScript. Retentativas em canplay, loadeddata, pageshow e gestos reais de toque/ponteiro/teclado. Requisições play concorrentes evitadas; mantém pausa fora da tela, em diálogos e com movimento reduzido. Variante mobile assets/hero-film-mobile-v1.mp4 gerada do vídeo enhanced fornecido pelo usuário, sem áudio, H.264 Baseline, 720x1280, 24fps e faststart, com duração integral e aproximadamente 72% menos bytes. Desktop mantém o arquivo enhanced original.

Validação: sintaxe/build, simulações de scroll reversível, ordem texto/vídeo, ausência de retenção, limite do rodapé em três alturas, autoplay rejeitado e retomado por gesto, movimento reduzido, regressões de menu/diálogos/carrossel, metadados/faststart e decodificação do vídeo. Não houve teste em iPhone físico. Referências técnicas: https://webkit.org/blog/6784/new-video-policies-for-ios/ e https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source . Publicação solicitada pelo usuário.


## Capa de compartilhamento
Capa original de 1200 × 630 em assets/compartilhamento-fernanda-v1.png, com fonte Bebas Neue e assinatura Mrs Saint Delafield já usadas no site, leque vetorial da marca e ilustração original do menu em nanquim branco. Composição editável autocontida em assets/compartilhamento-fernanda-v1.svg; textos convertidos em paths para garantir fidelidade. Renderizado com resvg a partir da composição vetorial, sem nova geração de imagem nem alterações no arquivo original do retrato. Ferramentas de render somente na pasta work ignorada, sem nova dependência do site ou do build.

Open Graph e Twitter Card configurados estaticamente no HTML com URL HTTPS absoluta, título, descrição, idioma, imagem, dimensões e texto alternativo. Canonical aponta para o domínio atual no Vercel. Arquivos gerados e configuração preparados localmente; a prévia de compartilhamento externa só poderá buscar a nova capa após publicação. O cache do aplicativo de destino pode demorar a atualizar. Referência técnica: https://ogp.me/ .

Capa v1 com a ilustração do menu aprovada para publicação pelo usuário. As versões adicionais com fotos reais serão apenas alternativas locais até escolha posterior.
