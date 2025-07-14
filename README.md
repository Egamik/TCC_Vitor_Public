
# Requisitos para execução
- Docker/compose

Para subir a rede basta rodar o script `main.sh`, ultilize a flag `-b` para buildar as imagens necessárias.

## Testes
Estão disponíveis no repositório duas maneiras de testar o projeto:
- Coleção de requisições para o POSTMAN
- Teste de carga por meio de k6
    - Executar script `run_test.sh`

Caso encontre dificuldades em buildar o projeto certifique-se que o build cache e volumes do docker estejam limpos.

## Notas
Este projeto foi desenvolvido usando código proprietário do LabSec na rede minifabric. Para que seja possível executar o projeto localmente é necessário realizar um fork do repositório `https://github.com/hyperledger-labs/minifabric` e realizar as adaptações necessárias para que a rede execute com os binários do Hyperledger Fabric V3.X. Recomenda-se que o minifabric seja inicializado como submódulo do repositório.