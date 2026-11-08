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
