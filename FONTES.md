# Tipografia do portfólio

## Fonte aplicada: Bodoni Moda

Alternativa de alto contraste à referência Harmony enviada, aplicada aos títulos editoriais. Os arquivos WOFF2 normal e itálico estão hospedados em `assets/fonts/`, acompanhados da licença SIL Open Font License em `assets/fonts/OFL-Bodoni-Moda.txt`.

Fonte oficial: https://fonts.google.com/specimen/Bodoni+Moda
Licença oficial: https://github.com/google/fonts/blob/main/ofl/bodonimoda/OFL.txt

Manrope continua nos textos e controles, Barlow Condensed nos títulos condensados e Mrs Saint Delafield na assinatura tipográfica.

## Nome da abertura no desktop

FERNANDA usa Bebas Neue, hospedada em `assets/fonts/bebas-neue-latin.woff2` com sua licença OFL em `assets/fonts/OFL-Bebas-Neue.txt`. Tahara usa Mrs Saint Delafield, como uma assinatura tipográfica. Nome e sobrenome ficam empilhados no campo vermelho.

Essas mudanças de posição e fonte do nome se aplicam somente ao desktop (a partir de 701px). O nome da abertura mobile mantém a composição e as fontes anteriores, conforme solicitado.

Fonte oficial: https://fonts.google.com/specimen/Bebas+Neue

## Harmony — referência, não incorporada

Fonte solicitada: Harmony, de Artem Nevsky.

Referência do autor: https://www.behance.net/gallery/122411115/HARMONY-Typeface

O autor informa no DaFont que o download gratuito é apenas para uso pessoal e aponta o fornecedor Pixel Surplus para as licenças:
https://www.dafont.com/harmony-4.font
https://pixelsurplus.com/products/harmony-modern-serif-font

No fornecedor há uma opção específica de licença Web Font. Não foi feita compra e não foi incorporado o arquivo gratuito de uso pessoal ao portfólio comercial. Bodoni Moda foi aplicada como alternativa com licença aberta.

Quando houver um arquivo autorizado para uso web (de preferência WOFF2), ele poderá ser incorporado localmente com @font-face e aplicado aos títulos editoriais. A assinatura tipográfica Tahara é um recurso separado e deve ser preservada.

## Estabilidade da abertura em recargas
Bebas Neue e Mrs Saint Delafield são hospedadas localmente e pré-carregadas no HTML. Ambas usam font-display:block para não mostrar o nome numa fonte substituta durante a recarga. A assinatura está em assets/fonts/mrs-saint-delafield-latin.woff2, convertida do arquivo oficial Google Fonts e acompanhada de OFL-Mrs-Saint-Delafield.txt. Essas fontes são usadas no desktop e no mobile; o posicionamento mobile foi preservado.

## Composição HELLO / MEET / FERNANDA
Os três textos do retrato usam Anton em caixa alta, hospedada localmente em assets/fonts/anton-latin.woff2, com OFL-Anton.txt. O nome da abertura mantém Bebas Neue e a assinatura anterior.


## Rasgo de papel realista — versão 2
Arquivo: `assets/papel-rasgado-realista-v2.png`, 2172 × 724, PNG com transparência externa e centro preto opaco. Criado com a ferramenta integrada image_gen. A referência enviada orienta o material e as bordas levantadas; sua imagem e marcas não foram incorporadas. Texto “sentir” permanece em HTML, amarelo, sobre a textura.

Prompt final utilizado:
> Create one ORIGINAL photorealistic torn-paper opening asset for a website, inspired by the physical curled torn edges shown in the user's latest reference (not its artwork or watermarks). A compact wide horizontal ragged aperture with a completely opaque matte near-black interior, surrounded only by narrow curled ivory/off-white torn paper edges with delicate gray shaded undersides and visible paper fibers. Like a hole ripped open in a sheet, not a flat sticker or painted brush stroke. Both upper and lower edges have several irregular small lifted folds; one modest curl at left, no huge roll. Wide horizontal proportions about 3:1, centered and tightly filling the image with only small transparent padding. The central black interior must provide a large unobstructed horizontal text-safe area, about 75% of the asset width and 65% height. All area outside the torn opening and its curled paper rim must be genuinely transparent alpha. Restrained realistic depth, soft contact shadows INSIDE the tear, not a large external cast shadow. Off-white edges should be thin, around 8-14% of asset height, so the asset stays readable behind one word at small size. Crisp material detail. NO letters, NO typography, NO watermark, NO logos, NO background sheet, NO scene, NO colored backdrop. This is a new original material asset, not removal of marks from the reference. Output a transparent PNG and make the generated local file path available.


## Destaque de sentir — Lacquer
Somente a palavra sentir usa Lacquer, fonte de traço manual irregular do Google Fonts. Arquivo local assets/fonts/lacquer-latin.woff2 e licença assets/fonts/OFL-Lacquer.txt. Cor amarela e rasgo de papel preservados; escala ajustada para manter a largura próxima da palavra anterior. Fonte oficial: https://fonts.google.com/specimen/Lacquer. Arquivos oficiais: https://github.com/google/fonts/tree/main/ofl/lacquer.


## Destaque de sentir — Gochi Hand (atual)
Lacquer substituída por Gochi Hand apenas no destaque de sentir, em caixa alta, preservando amarelo e rasgo. Referência: lettering vetorial das palavras vermelhas de worksruthi.com; Gochi Hand é uma aproximação tipográfica de traço arredondado, não a fonte exata da referência. Fonte oficial: https://fonts.google.com/specimen/Gochi+Hand. Arquivo local assets/fonts/gochi-hand-latin.woff2; licença OFL em assets/fonts/OFL-Gochi-Hand.txt. Originais: https://github.com/google/fonts/tree/main/ofl/gochihand.


## Sentir — Burnts Marker (teste local atual)
Fonte exata do link enviado: https://www.dafontfree.co/burnts-marker-font/ . A página identifica a distribuição gratuita como Personal Use Only; uso no portfólio publicado depende de licença comercial/web. Não foi feita compra.

Amostra Burnts_reg extraída do arquivo fornecido pela página, com conversão local para work/burnts-marker-local.woff2. Carregada apenas em localhost/127.0.0.1 por regra no cabeçalho; work é ignorado pelo Git e não integra o build. Em produção, Gochi Hand permanece como fallback até fornecimento da licença e arquivo autorizado. Cor e imagem do papel preservadas; altura de linha ajustada para manter o encaixe da frase. Nenhum deploy realizado nesta atualização.

Autor/compra indicados pela página: https://creativemarket.com/ramandhani/461132-Burnts-Marker-%28Tagging-Style%29-50off .


## Sentir — lettering de pincel seco (atual)
Burnts Marker removida da composição e do carregamento local. Destaque agora usa lettering original criado com a ferramenta integrada image_gen a partir da referência visual enviada, sem incorporar uma fonte comercial. Arquivo: assets/sentir-pincel-seco-v1.png, com transparência, aplicado como máscara CSS na cor amarela. Texto sentir preservado para acessibilidade. Papel rasgado mantido. Sem deploy.

Prompt final da versão aplicada:
> Use the attached image strictly as a lettering style reference. Create a new standalone word graphic that reads exactly SENTIR, S E N T I R, six uppercase letters in one horizontal line. Closely match the broad DRY PAINTBRUSH lettering of the large word BRUSH in the reference: thick hand-painted bold strokes, slightly right slanted, energetic but legible, many fine long parallel bristle streaks and paint gaps inside strokes, irregular feathery edges, expressive rounded S and R, clear simple I. NOT graffiti tagging, NOT thin handwriting, NOT a smooth marker font. All strokes are one flat warm golden yellow #f4cb53. Genuine transparent alpha everywhere outside letters AND in the fine paint gaps; no background, no paper, no shadow, no glow, no extra words, no alphabet. Horizontal wide composition approximately 3.4:1. The word must fill almost the entire canvas, centered, with only 2-3% transparent padding on each side. Preserve high contrast and solid enough letter cores so it remains legible at 150 px wide. Do not reproduce the word BRUSH or the source alphabet. Only SENTIR. This asset will be placed over a separate black torn-paper texture in a website.


## Sentir em minúsculas (atual)
Arquivo aplicado: assets/sentir-pincel-minusculo-v2.png. Variação gerada pela ferramenta integrada image_gen, com o lettering anterior como referência, preservando transparência. Prompt: “Change only the lettering case. Replace uppercase SENTIR with the word sentir in ALL LOWERCASE: s e n t i r. Preserve the bold dry-paintbrush style, slight right slant, ragged bristle edges, paint scratches and warm golden yellow color. Lowercase i with a separate dot, lowercase n and r. One instance only. Genuine transparent alpha; no background, no paper, no shadows, no extra graphics. Wide horizontal canvas with small transparent border.” Layout, cor e papel mantidos. Sem deploy.


## Sentir minúsculo com menos preenchimento (atual)
Imagem editada pela ferramenta integrada image_gen em assets/sentir-pincel-minusculo-v3.png. Prompt: preservar palavra sentir em minúsculas, formas e proporções; reduzir cobertura de tinta em 30–40% com longas falhas transparentes de pincel seco, sem acrescentar elementos. Aplicada com máscara vetorial complementar assets/pincel-falhas.svg para abrir falhas reais no traço. Lettering reduzido visualmente em 9% dentro do papel, sem alterar espaçamento da frase nem tamanho do rasgo. Sem deploy.


## Sentir — Amanojaku (atual)
Fonte fornecida diretamente pelo usuário: Amanojaku Demo.otf. Original preservado em assets/fonts/Amanojaku-Demo.otf e cópia web em assets/fonts/amanojaku-demo.woff2. Aplicada somente à palavra SENTIR em caixa alta, como texto HTML; lettering raster e máscara de falhas removidos da composição. Escala ajustada para manter o encaixe no papel. Cor e rasgo preservados. Nenhuma licença adicional foi adquirida e nenhum deploy foi realizado.
