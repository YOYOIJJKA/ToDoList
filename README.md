# Глобальные замечания:

1. Запросы уходящие на http://localhost:3000 это что такое? Если у тебя локально развёрнут бэкенд лайв-сервер, как проверить работоспособность твоей программы? Переделываем следующим образом: добавляем interceptor перехватывающий запросы на http://localhost:3000, делаем вид работы с бэком, но под капотом реализуем логику сохранения/чтения в localStorage
2. Оформляем константы там где они должны быть
3. Все комментарии к коду пишем на русском. Шаблоны тоже используют русский текст, если очень хочется разные языки - подключаем интернализацию
4. Не используем non-null assertion. Вообще. Никогда.
5. Длинные трубы, максимально избегаем подписок
6. Есть какие-то проблемы с форматированием кода, подключаем prettier - радуемся. Главное установить отступ tab, величина 4 пробела
7. Вычищаем неиспользуемый мусор по коду (пустые импорты, неиспользуемые константы, закомментированный код)
8. Изучаем сигналы, нужно понять зачем они. Прикрепил хорошую статью на хабре в TODO в коде.
9. Никаких px в scss, одно из требований - адаптив, поэтому переходим на относительные значения rem, %, vh и т.д.
10. [ngClass]="{'has-error': userForm.get('login')?.invalid && userForm.get('login')?.touched}" такое делать не нужно, правильная работа с валидаторами формы и matInput закрывает все потребности

# ToDoList

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# ToDolist
