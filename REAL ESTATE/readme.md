---
# API
---

## Folder Structuring of Real Estate Project backend

    .

    ├── controller
    |   |-- purchaser
    |       |-- auth.controller.js
    |       |-- home.controller.js
    |       |-- paymentOptions.controller.js
    |       |-- profile.controller.js
    |       |-- reminder.controller.js
    |       |-- wishlist.controller.js
    |   |-- vendor
    |       |-- auth.controller.js
    |       |-- product.controller.js
    |       |-- store.controller.js
    |   |-- admin
    |       |-- auth.controller.js
    |       |-- category.controller.js
    ├── Helper
    |   |--
    ├── middleware
    |   |-- tokenVerify.js
    |   |-- validation.js
    ├── routes
    |   |-- v1
    |       |-- purchaser
    |           |-- purchaser.routes.js
    |           |-- auth.routes.js
    |           |-- home.routes.js
    |           |-- paymentOptions.routes.js
    |           |-- profile.routes.js
    |       |-- vendor
    |           |-- vendor.routes.js
    |           |-- auth.routes.js
    |           |-- store.routes.js
    |       |-- admin
    |           |-- admin.routes.js
    |           |-- auth.routes.js
    |   |-- v1.js
    |
    ├── services
    |   |-- purchaser
    |       |-- auth.service.js
    |       |-- home.service.js
    |       |-- paymentOptions.service.js
    |       |-- profile.service.js
    |       |-- reminder.service.js
    |       |-- wishlist.service.js
    |       |-- purchaser.service.js
    |   |-- vendor
    |       |-- auth.service.js
    |       |-- product.service.js
    |       |-- store.service.js
    |   |-- admin
    |       |-- auth.service.js
    |       |-- category.service.js
    ├── utils
    |-- index.js
    |-- cronJob.js   // This is schedulig file
    |-- readme.md
