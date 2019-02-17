---
layout: post
title:  "UI Testing pyramid"
date:   2019-01-28 09:00:00 +0100
categories: testing ui
---



UI Testing pyramid is different than backend software, it can be divided in more layers and it is multidimensional. Proper understanding all layers, leads to writing better suited tests that run fast stable and properly test the code.






As long as we can generalize UI testing and throw them to the same bucket as any other testing strategy, I think we need to look deeper at various types of testing when it comes to UI.

In general we talk about 3 types of tests, unit, integration and end to end. But there are much more to UI testing than that.

To understand what is needed to properly automate UI testing we need to understand the UIs themselves. How they are build, how they are put together, how the particular elements of the UIs communicate with each other, what are user interactions and how user is routed through the application flow.





It's very important to understand the role of each layer as that knowledge allows for the accurate placing of verification code (tests) onto the correct level (i.e. form validations must not be tested on smoke level.)

This document tries to explain what each layer must and must not include. To indicate the requirement level, the nomenclature from [rfc2119] is used (no we are not that professional, it just seems fitting this time.)

[rfc2119](https://tools.ietf.org/html/rfc2119)
