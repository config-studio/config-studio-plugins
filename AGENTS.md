# Config Studio Plugins Registry — AI Agent Rules 🚀

## 🛠️ Главные регламенты реестра плагинов
1. **Реестр пакетов и дистрибуция:** Репозиторий `config-studio-plugins` служит центральным каталогом метаданных `registry.json` для экосистемы Config Studio. Все пакеты `.cspkg` распространяются строго через GitHub Releases каждого плагина (в git-репозитории бинарники не хранятся).
2. **One Repo Per Plugin:** Исходный код каждого плагина ведется в его отдельном изолированном репозитории со своими тестами и релизным циклом. В данный репозиторий вносятся только метаданные манифестов и ссылки на релизы.
3. **Обязательный релиз плагина через GitHub Workflow (CI/CD Automated Releases):** Пакеты `.cspkg` собираются и верифицируются через GitHub Actions Workflow репозиториев плагинов.
4. **Инженерная дисциплина (/ub-mode):** Минимальный диф, проверка целостности контрольных сумм и синхронизация `registry.json`.

<!-- doubled-graph:phase:start -->
## doubled-graph phase
phase: migration
updated: 2026-11-07
<!-- reason: Existing codebase onboarding -->
<!-- doubled-graph:phase:end -->
