# PYF Attendance Dashboard and Monitor
![CI Test](https://github.com/Ray-F/pyf-attendance/workflows/CI%20Test/badge.svg?branch=master&event=push)

**Author:** Raymond Feng [Ray-f](https://github.com/ray-f) (<rf.raymondfeng@gmail.com>)

**Contributors:** Michael Howell [Mykhol](https://github.com/mykhol) (<michael@nunc.co.nz>), Matthew Ouyang [mouyang2001](https://github.com/mouyang2001)


## How to use this repository

### Prerequisites
- `node` (version 14.15+) is installed
- `yarn` is installed

### Steps to initialize project
1) Run `yarn install` in the root directory
2) Run `yarn run init` in the root directory

### Steps to start development environment
1) Run `yarn run start` in the root directory


### Required environment file
- Create a file under `server/.env` with the following fields

```
MONGODB_URI_DEV = <MONGODB_DEV_URI>
ENV = DEV
PORT = 9001
```

Contact <rf.raymondfeng@gmail.com> to get a DEV URI.
