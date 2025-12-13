# Tentshift

line scheduler for k-ville (fk spreadhseets)

Ideally this provides a way for everyone to just upload there calendar and have it automatically schedule a fair shift for all. Then everyone can subscribe to their schedule (have it exported to cal app of choice) and also trade shifts with others.

WIP for MVP:

- [ ] Refine design
  - [x] Header
    - [x] Editable Name, Team Profile pic
  - [ ] Scroll interactions on page
  - [x] Dark/Lightmode fix
  - [x] fix coloring, theming
  - [ ] Responsiveness of selecting
  - [ ] Unify design (big time difficult)
  - [ ] Tabs ansd tabbing
    - [ ] Tabs to the top
    - [ ] remove unnecessary info stuff
    - [ ] duke brand hover and tabbing
- [ ] Frontend
  - [x] Summary Page
    - [x] View next few shifts
    - [x] Safe or not etc
    - [x] Personal info
  - [x] Trading Page
    - [x] Offers as a swap or as a handoff
    - [x] creating/delete/reject trades (partial or full shifts)
    - [x] accept/view trade link to send to messages (tent group)
  - [x] About Page + Dono + Footer?
- [x] Add database integration
  - [x] Fix slop schemas make sure business and db logic match
- [ ] Add backend
  - [ ] Upload Calendar
  - [ ] Subscribe to schedule
  - [ ] Add core feature: Generate shifts
- [x] Auth
- [ ] Set up CI/CD
  - [ ] deploy for reviews
