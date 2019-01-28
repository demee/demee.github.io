---
layout: post
title:  "UI Testing pyramid"
date:   2019-01-28 09:00:00 +0100
categories: testing ui
---

It's very important to understand the role of each layer as that knowledge allows for the accurate placing of verification code (tests) onto the correct level (i.e. form validations must not be tested on smoke level.)

This document tries to explain what each layer must and must not include. To indicate the requirement level, the nomenclature from [rfc2119] is used (no we are not that professional, it just seems fitting this time.)

[rfc2119](https://tools.ietf.org/html/rfc2119)