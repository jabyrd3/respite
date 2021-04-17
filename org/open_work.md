# first tranche
*legend*: x is "done", s is "some"
- [ ] apikey subsystem
- [ ] get dhcplb wired into container via puk/dockerfile: unassigned
- [ ] finish puk
    - [ ] add healthchecks to puk
    - [ ] config api for puk
    - [ ] watchdogs
- [ ] dhcp crud: unassigned
- [ ] dhcp api & server integration: unassigned
- [ ] ipam/dhcp api spec: victor
- [ ] lua record handling: unassigned
- [ ] add static caching for prod mode in server.mjs

# in progress
- [x] basic portal: jbyrd [inprogress]
    - [ ] static asset serving
    - [ ] basic templated component class
    - [ ] login page
    - [ ] router
    - [ ] state manager
    - [ ] components render funcs called on state changes
        - [ ] calculate which functions to call for rerender to save cpu
- [s] domains crud: jbyrd [inprogress]
- [s] records crud: jbyrd [inprogress]

# done
- [x] rough in example api routes and patterns: jbyrd [done]
- [x] records crud: jbyrd [inprogress]
- [x] add middlware support to server.mjs
    - [x] write user auth middleware: unassigned
    - [x] write domain-ownership middleware: unassigned
- [x] support multiple routeparams in server.mjs: unassigned
