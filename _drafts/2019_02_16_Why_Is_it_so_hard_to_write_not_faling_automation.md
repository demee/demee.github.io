---
layout: post
title:  "Stable automation"
date:   2019-02-01 09:00:00 +0100
categories: testing ui
---

# Hardening UI Automation Suite

Properly running Automation framework is a great, amazing thing to have for a complex Web UI. Number of hours spent testing manually the website is great, and who has time for that? Well, computers do! And also, they are much faster than humans.

But also much dumber... and here is the problem, they just do what they are told to, and that's not always good thing.

Fact is, that I have never seen fully working, stable automation system for UI, and I worked with many, I'm even guilty of creating a few. And even when starting with new green field, on simple project, when the situation, seems to be clear, there is always that moment when things just snap. Tests just fail, fail at random and fail inconsistently. There is no patterns, there is no repeatability.

When does it happen? Usually when our Automation Suite rapidly grows. First test, two test, ten, a hundred. Usually I have noticed that just with few dozens tests things go unstable. Modern world CI systems usually mean fail if even only one test fails. And that's good and bad. Good, because we cannot let things to slip true. The, somewhat righteously passed, notion of "unstable but ok" build is no longer in play. But it's bad, because any slight instability manifests itself with a big crash of the whole CI pipeline, blocking everyone, prevening developers from "Continusly Integratin" ( pun intendet ) more code. Simply because the contuity is broken.

With failing Automation the situation we find ourselves is sick. It's not only hard to distinguish problems from noise, but also when the problem actually happens, it way harder to convince your colleagues that the problem actually exists, so they may ignore you, and you would need to produce extra evidence of the problem, other than your always failing automation. Not even mention time spent on repairing always failing Automation suite.

How do we fix it, how do we approach it. How to we make it happen so they only fail where there is a problem.

## Identifying a problem

First we need to find out what is our problem. And to identify the problem we need data.


Main problem are:

* Problems with rendering
  * page renders to slow, tests are usually much quicker and the


## Why things go unstable after some time.

## Tests should not depend on each other
## We should give the page time to respond
