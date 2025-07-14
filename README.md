
# Requisitos para execução
- Docker/compose

Para subir a rede basta rodar o script `main.sh`, ultilize a flag `-b` para buildar as imagens necessárias.

## Testes
Estão disponíveis no repositório duas maneiras de testar o projeto:
- Coleção de requisições para o POSTMAN
- Teste de carga por meio de k6
    - Executar script `run_test.sh`

Caso encontre dificuldades em buildar o projeto certifique-se que o build cache e volumes do docker estejam limpos.