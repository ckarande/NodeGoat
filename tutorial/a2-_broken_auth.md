### Description

In this attack, an attacker (who can be anonymous external attacker, a user
with own account who may attempt to steal data from accounts, or an insider
wanting to disguise his or her actions) uses leaks or flaws in the
authentication or session management functions to impersonate other users.
Application functions related to authentication and session management are
often not implemented correctly, allowing attackers to compromise passwords,
keys, or session tokens, or to exploit other implementation flaws to assume
other users’ identities.

Developers frequently build custom authentication and session management
schemes, but building these correctly is hard. As a result, these custom
schemes frequently have flaws in areas such as logout, password management,
timeouts, remember me, secret question, account update, etc. Finding such
flaws can sometimes be difficult, as each implementation is unique.

- Exploitability: AVERAGE
- Prevalence: WIDESPREAD
- Detectability: AVERAGE
- Technical Impact: SEVERE