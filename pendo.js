// Pendo Agent Wrapper
// Environment:    production
// Agent Version:  2.15.16
// Installed:      2019-01-25T18:19:19Z
(function(PendoConfig) {
  !(function(window, document, undefined) {
    function shouldLoadStagingAgent(e) {
      if (e && e.stagingServers && e.stagingAgentUrl)
        for (var t = 0, n = e.stagingServers.length; n > t; ++t) {
          var i = e.stagingServers[t];
          if (
            ("string" == typeof i && (i = new RegExp("^" + i + "$")),
            i instanceof RegExp && i.test(location.host))
          )
            return !0;
        }
      return !1;
    }
    function loadStagingAgent(e) {
      return shouldLoadStagingAgent(e)
        ? (includeScript(e.stagingAgentUrl), !0)
        : !1;
    }
    function includeScript(e) {
      var t = "script",
        n = document.createElement(t);
      (n.async = !0), (n.src = e);
      var i = document.getElementsByTagName(t)[0];
      i.parentNode.insertBefore(n, i);
    }
    function getPendoConfigValue(e) {
      return "undefined" != typeof PendoConfig ? PendoConfig[e] : void 0;
    }
    ("undefined" != typeof PendoConfig && loadStagingAgent(PendoConfig)) ||
      (!(function() {
        "use strict";
        function Eventable() {
          var e = (this._handlers = {});
          return (
            (this.on = function(t, n) {
              if (_.isString(t) || _.isFunction(n)) {
                var i = e[t];
                i || (i = e[t] = []), _.indexOf(i, n) < 0 && i.push(n);
              }
              return this;
            }),
            (this.one = function(e, t) {
              var n = this,
                i = function() {
                  n.off(e, i), t.apply(this, arguments);
                };
              return this.on(e, i);
            }),
            (this.off = function(t, n) {
              var i = e[t];
              if (_.isFunction(n)) {
                var r = _.indexOf(i, n);
                i && r >= 0 && i.splice(r, 1);
              } else i && n === undefined && (i.length = 0);
              return this;
            }),
            (this.trigger = function(t) {
              var n = e[t],
                i = _.toArray(arguments).slice(1),
                r = _.map(n, function(e) {
                  var t = e.apply(pendo, i);
                  return t === !1 ? q.reject() : t;
                });
              return q.all(r);
            }),
            this
          );
        }
        function backupObjectState(e, t) {
          var n = {};
          return (
            t || (t = _.keys(e)),
            _.each(t, function(t) {
              var i = e[t];
              _.isArray(i) ? (n[t] = i.slice()) : _.isFunction(i) || (n[t] = i);
            }),
            function() {
              _.each(n, function(t, n) {
                e[n] = t;
              });
            }
          );
        }
        function getNow() {
          return new Date().getTime();
        }
        function isSfdcLightning() {
          return (
            "undefined" != typeof $A &&
            _.isFunction($A.get) &&
            _.isString($A.get("$Browser.formFactor"))
          );
        }
        function createStatefulIterator(e) {
          function t(t, n) {
            if (!n) return t;
            for (var i = 0, r = t.length; r > i; ++i)
              if (e(t[i], i) === n)
                return t.slice(i + 1).concat(t.slice(0, i + 1));
            return t;
          }
          function n(n, i) {
            if (n && n.length) {
              n = t(n, this.lastKey);
              for (var r = 0; r < n.length; ++r)
                if (i(n[r], r)) return void (this.lastKey = e(n[r], r));
              this.lastKey = null;
            }
          }
          function i() {
            this.lastKey = null;
          }
          return (
            _.isFunction(e) ||
              (e = function(e, t) {
                return t;
              }),
            { lastKey: null, eachUntil: n, reset: i }
          );
        }
        function throttleIterator(e, t) {
          return (
            (t.eachUntil = _.wrap(t.eachUntil, function(t, n, i) {
              var r = getNow();
              return t.call(this, n, function() {
                return i.apply(this, arguments) || Math.abs(getNow() - r) >= e;
              });
            })),
            t
          );
        }
        function documentScrollTop() {
          var e = document.documentElement;
          return (
            (window.pageYOffset || e.scrollTop || getBody().scrollTop) -
            (e.clientTop || 0)
          );
        }
        function documentScrollLeft() {
          var e = document.documentElement;
          return (
            (window.pageXOffset || e.scrollLeft || getBody().scrollLeft) -
            (e.clientLeft || 0)
          );
        }
        function bodyOffset() {
          var e = getBody();
          if (e) {
            var t = getComputedStyle_safe(e);
            if (
              t &&
              ("relative" === t.position ||
                "absolute" === t.position ||
                hasCssTransform(t))
            ) {
              var n = e.getBoundingClientRect();
              return {
                top: n.top + documentScrollTop(),
                left: n.left + documentScrollLeft()
              };
            }
          }
          return { top: 0, left: 0 };
        }
        function positionFixedActsLikePositionAbsolute() {
          return (
            hasCssTransform(getComputedStyle_safe(getBody())) && isNaN(msie)
          );
        }
        function hasCssTransform(e) {
          if (e && _.isFunction(e.getPropertyValue)) {
            var t = [e.getPropertyValue("transform")];
            return (
              "undefined" != typeof vendorPrefix &&
                _.isString(vendorPrefix) &&
                t.push(
                  e.getPropertyValue(
                    "-" + vendorPrefix.toLowerCase() + "-transform"
                  )
                ),
              _.any(t, function(e) {
                return e && "none" !== e;
              })
            );
          }
          return !1;
        }
        function applyBodyOffset(e) {
          var t = bodyOffset();
          return (
            (e.left -= t.left),
            (e.top -= t.top),
            _.isNumber(e.right) && (e.right -= t.left),
            _.isNumber(e.bottom) && (e.bottom -= t.top),
            e
          );
        }
        function roundOffsetPosition(e) {
          return (
            _.each(["left", "top", "width", "height"], function(t) {
              e[t] = Math.round(e[t]);
            }),
            e
          );
        }
        function getOffsetPosition(e) {
          var t, n, i;
          if (!e) return { width: 0, height: 0 };
          if (
            ((t = {
              width: _.isNumber(e.offsetWidth) ? e.offsetWidth : 0,
              height: _.isNumber(e.offsetHeight) ? e.offsetHeight : 0
            }),
            (n = 0),
            (i = 0),
            e.getBoundingClientRect)
          ) {
            var r;
            try {
              r = e.getBoundingClientRect();
            } catch (o) {
              return { width: 0, height: 0 };
            }
            return (
              (t.top = r.top),
              (t.left = r.left),
              (t.width = Math.max(t.width, _.isNumber(r.width) ? r.width : 0)),
              (t.height = Math.max(
                t.height,
                _.isNumber(r.height) ? r.height : 0
              )),
              isPositionFixed(e)
                ? (t.fixed = !0)
                : ((t.top += documentScrollTop()),
                  (t.left += documentScrollLeft()),
                  (t = applyBodyOffset(t))),
              roundOffsetPosition(t)
            );
          }
          for (; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop); )
            (n += e.offsetLeft), (i += e.offsetTop), (e = e.offsetParent);
          return (t.top = i), (t.left = n), roundOffsetPosition(t);
        }
        function isInDocument(e) {
          return Sizzle.contains(document, e);
        }
        function hasParentWithCssTransform(e) {
          for (var t, n = e && e.parentNode; n; ) {
            if (((t = getComputedStyle_safe(n)), hasCssTransform(t))) return !0;
            n = n.parentNode;
          }
          return !1;
        }
        function isPositionFixed(e) {
          for (var t, n = e; n; ) {
            if (((t = getComputedStyle_safe(n)), !t)) return !1;
            if ("fixed" === t.position)
              return isNaN(msie) ? !hasParentWithCssTransform(n) : !0;
            n = n.parentNode;
          }
          return !1;
        }
        function getOverflowDirection(e, t) {
          var n = getComputedStyle_safe(e);
          return (
            (t = t || /(auto|scroll|hidden)/),
            n
              ? t.test(n.overflowY) && t.test(n.overflowX)
                ? OverflowDirection.BOTH
                : t.test(n.overflowY)
                ? OverflowDirection.Y
                : t.test(n.overflowX)
                ? OverflowDirection.X
                : t.test(n.overflow)
                ? OverflowDirection.BOTH
                : OverflowDirection.NONE
              : OverflowDirection.NONE
          );
        }
        function isVisibleInScrollParent(e, t, n) {
          var i = getClientRect(t),
            r = getOverflowDirection(t, n);
          if (r === OverflowDirection.BOTH && !intersectRect(e, i)) return !1;
          if (r === OverflowDirection.Y) {
            if (e.top >= i.bottom) return !1;
            if (e.bottom <= i.top) return !1;
          }
          if (r === OverflowDirection.X) {
            if (e.left >= i.right) return !1;
            if (e.right <= i.left) return !1;
          }
          return !0;
        }
        function isBodyElement(e) {
          return e && e.nodeName && "body" === e.nodeName.toLowerCase();
        }
        function isElementVisibleInBody(e) {
          if (!e) return !1;
          if (isBodyElement(e)) return !0;
          var t = getClientRect(e);
          if (0 === t.width || 0 === t.height) return !1;
          var n = getComputedStyle_safe(e);
          if (n && "hidden" === n.visibility) return !1;
          for (var i = e; i && n; ) {
            if ("none" === n.display) return !1;
            if (Number(n.opacity) <= 0) return !1;
            (i = i.parentNode), (n = getComputedStyle_safe(i));
          }
          return !0;
        }
        function isElementVisible(e, t) {
          if (!isElementVisibleInBody(e)) return !1;
          if (isBodyElement(e)) return !0;
          var n = getClientRect(e);
          t = t || /hidden/;
          for (
            var i = getScrollParent(e, t), r = null, o = getBody();
            i && i !== o && i !== document && i !== r;

          ) {
            if (!isVisibleInScrollParent(n, i, t)) return !1;
            (r = i), (i = getScrollParent(i, t));
          }
          if (e.getBoundingClientRect) {
            var a = e.getBoundingClientRect(),
              s = a.right,
              d = a.bottom;
            if (
              (n.fixed ||
                ((s += documentScrollLeft()), (d += documentScrollTop())),
              0 >= s || 0 >= d)
            )
              return !1;
          }
          return !0;
        }
        function scrollIntoView(e) {
          var t,
            n,
            i,
            r,
            o,
            a,
            s = /(auto|scroll)/,
            d = getBody();
          if (!isElementVisible(e, s))
            for (n = getScrollParent(e, s); n && n !== d; )
              (t = getClientRect(e)),
                (i = getClientRect(n)),
                (r = 0),
                (o = 0),
                t.bottom > i.bottom &&
                  ((r += t.bottom - i.bottom), (t.top -= r), (t.bottom -= r)),
                t.top < i.top &&
                  ((a = i.top - t.top),
                  (r -= a),
                  (t.top += a),
                  (t.bottom += a)),
                t.right > i.right &&
                  ((o += t.right - i.right), (t.left -= o), (t.right -= o)),
                t.left < i.left &&
                  ((a = i.left - t.left),
                  (o -= a),
                  (t.left += a),
                  (t.right += a)),
                (n.scrollTop += r),
                (n.scrollLeft += o),
                (n = getScrollParent(n, s));
        }
        function evalScript(e) {
          var t = document.createElement("script"),
            n =
              document.head ||
              document.getElementsByTagName("head")[0] ||
              document.body;
          (t.type = "text/javascript"),
            e.src
              ? (t.src = e.src)
              : (t.text = e.text || e.textContent || e.innerHTML || ""),
            n.appendChild(t),
            n.removeChild(t);
        }
        function dom(e, t) {
          var n,
            i,
            r = this;
          if (e && e instanceof dom) return e;
          if (!(r instanceof dom)) return new dom(e, t);
          if (e)
            if (e.nodeType) n = [e];
            else if ((i = /^<(\w+)\/?>$/.exec(e)))
              n = [document.createElement(i[1])];
            else if (/^<[\w\W]+>$/.test(e)) {
              var o = document.createElement("div");
              (o.innerHTML = e), (n = _.toArray(o.childNodes));
            } else
              _.isString(e)
                ? (t instanceof dom && (t = t.length > 0 ? t[0] : null),
                  (n = Sizzle(e, t)))
                : (n = [e]);
          else n = [];
          return (
            _.each(n, function(e, t) {
              r[t] = e;
            }),
            (r.context = t),
            (r.length = n.length),
            r
          );
        }
        function shouldReloadGuides(e, t) {
          return e && pendo.apiKey
            ? areGuidesDisabled() &&
              "true" !== pendoLocalStorage.getItem("pendo-designer-mode")
              ? !1
              : e !== reloadGuides.lastUrl || t !== reloadGuides.lastVisitorId
            : !1;
        }
        function reloadGuides(e) {
          var t = pendo.get_visitor_id();
          (e = e || pendo.url.get()),
            shouldReloadGuides(e, t) &&
              ((reloadGuides.lastUrl = e),
              (reloadGuides.lastVisitorId = t),
              pendo.loadGuides(pendo.apiKey, t, e));
        }
        function forceGuideReload() {
          (reloadGuides.lastUrl = null), queueGuideReload();
        }
        function flushCallQueue() {
          if (_.isArray(pendo._q) && !_.isEmpty(pendo._q)) {
            var e = pendo._q.splice(0, pendo._q.length),
              t = _.reduce(
                e,
                function(e, t) {
                  if (!_.isArray(t)) return e;
                  var n = pendo[t.shift()];
                  return _.isFunction(n)
                    ? e.then(function() {
                        return n.apply(pendo, t);
                      })
                    : e;
                },
                q.resolve()
              );
            return t.then(flushCallQueue);
          }
        }
        function getDataHost() {
          var e = getPendoConfigValue("dataHost");
          return e
            ? "https://" + e
            : getOption("dataHost", "https://app.pendo.io");
        }
        function writeEvent(e, t) {
          var n = new Date().getTime();
          return writeBeacon(t, { v: VERSION, ct: n, jzb: e });
        }
        function writeTrackEvent(e, t) {
          var n = new Date().getTime();
          return writeBeacon(t, { v: VERSION, ct: n, jzb: e, type: "track" });
        }
        function postEvent(e, t) {
          var n = new Date().getTime();
          return q.all(
            eachApiKey(t, function(i) {
              var r = buildBaseDataUrl(t + ".gif", i, {
                v: VERSION,
                ct: n,
                s: e.length
              });
              return pendo.ajax.post(r, e, { "Content-Type": "text/plain" });
            })
          );
        }
        function eachApiKey(e, t) {
          var n = [pendo.apiKey];
          return (
            "ptm" === e &&
              pendo.additionalApiKeys &&
              (n = n.concat(pendo.additionalApiKeys)),
            pendo._.map(n, t)
          );
        }
        function writeBeacon(e, t) {
          return q.all(
            eachApiKey(e, function(n) {
              var i = buildBaseDataUrl(e + ".gif", n, t);
              return writeImgTag(i);
            })
          );
        }
        function writeErrorPOST(e) {
          try {
            var t = HOST + "/data/errorlog?apiKey=" + pendo.apiKey;
            getPendoConfigValue("blockLogRemoteAddress") && (t += "&log=0");
            var n = pendo.ajax.postJSON(t, {
              error: e,
              version: "v" + VERSION,
              visitorId: pendo.get_visitor_id()
            });
            return n.then(
              function() {
                pendo.log("successfully wrote error");
              },
              function(e) {
                pendo.log("error writing error:" + e);
              }
            );
          } catch (i) {
            return (
              log("Failed to write error to server using POST endpoint: " + i),
              writeMessage(
                "Failed to write error to server using POST endpoint: " + i
              )
            );
          }
        }
        function writeImgTag(e) {
          if (!isUnlocked()) return q.resolve();
          if (isInPreviewMode()) return q.resolve();
          var t = q.defer(),
            n = new Image();
          return (
            (n.onload = function() {
              t.resolve();
            }),
            (n.onerror = function() {
              t.reject();
            }),
            (n.src = e),
            t.promise
          );
        }
        function addToHistory(e) {
          return (
            eventHistory.push([].concat(e)),
            eventHistory.length > 100 &&
              (debug("Pruning earliest 50 items from history"),
              eventHistory.splice(0, 50)),
            e
          );
        }
        function callLater(e, t) {
          if (((t = parseInt(t) || 0), e[t])) return e[t];
          var n = window.setTimeout(function() {
            e(), e[t]();
          }, t);
          return (e[t] = function() {
            window.clearTimeout(n), delete e[t];
          });
        }
        function flush(e, t) {
          return e.splice(0, null == t ? e.length : t);
        }
        function flushBy(e, t) {
          return pendo._.reduceRight(
            e,
            function(n, i, r, o) {
              return t(i, r, o) && n.unshift.apply(n, e.splice(r, 1)), n;
            },
            []
          );
        }
        function flushEvents(e) {
          return aggregateEvents(buffers.flush(buffers.events, e));
        }
        function flushTrackEvents(e) {
          return aggregateTrackEvents(buffers.flush(buffers.trackEvents, e));
        }
        function flushSilos(e) {
          return transmitSilos(
            e
              ? buffers.flush(buffers.silos)
              : buffers.flushBy(buffers.silos, function(e) {
                  return e && e.full;
                })
          );
        }
        function flushTrackEventSilos(e) {
          return transmitSilos(
            e
              ? buffers.flush(buffers.trackEventSilos)
              : buffers.flushBy(buffers.trackEventSilos, function(e) {
                  return e && e.full;
                })
          );
        }
        function flushBeacons(e) {
          var t = e ? undefined : 1;
          return writeBeacons(buffers.flush(buffers.beacons, t)).then(
            function() {
              callLater(flushBeacons, 1);
            }
          );
        }
        function flushNow(e) {
          try {
            buffers.flushEvents(), buffers.flushTrackEvents();
          } catch (t) {
            return (
              writeException(t, "unhandled error while flushing event cache"),
              q.reject(t)
            );
          }
          try {
            buffers.flushSilos(e), buffers.flushTrackEventSilos(e);
          } catch (t) {
            return (
              writeException(t, "unhandled error while flushing silo cache"),
              q.reject(t)
            );
          }
          try {
            return buffers.flushBeacons(e);
          } catch (t) {
            return (
              writeException(t, "unhandled error while writing beacons"),
              q.reject(t)
            );
          }
        }
        function flushLater(e) {
          return callLater(_.partial(flushNow, !0), e);
        }
        function flushEvery(e) {
          if (
            ((e = parseInt(e) || 0),
            pendo._.isObject(flushEvery.intervals) ||
              (flushEvery.intervals = {}),
            !flushEvery.intervals[e])
          ) {
            var t = window.setInterval(pendo.flushNow, e);
            return (flushEvery.intervals[e] = function() {
              clearInterval(t), delete flushEvery.intervals[e];
            });
          }
        }
        function flushStop() {
          var e = pendo._.values(flushEvery.intervals).concat([
            pendo.flushNow,
            flushBeacons
          ]);
          pendo._.map(e, function(e) {
            pendo._.isFunction(e) && e();
          });
        }
        function buffersClearAll() {
          pendo._.map(
            [
              pendo.buffers.events,
              pendo.buffers.trackEvents,
              pendo.buffers.silos,
              pendo.buffers.beacons
            ],
            function(e) {
              pendo.buffers.flush(e);
            }
          ),
            flushStop();
        }
        function eventCreate(e, t, n, i) {
          var r = {
            type: e,
            browser_time: new Date().getTime(),
            visitor_id: pendo.get_visitor_id(),
            account_id: pendo.get_account_id(),
            url: n,
            props: t
          };
          return "track" === e && (r.track_event_name = i), r;
        }
        function collectEvent(e, t, n, i) {
          var r = eventCreate(e, t, n, i);
          return "track" === e ? enqueueTrackEvent(r) : enqueueEvent(r);
        }
        function enqueueEvent(e) {
          return (
            (e.url = pendo.url.externalizeURL(e.url)),
            eventsCanAddEvent(events, e) && pendo.buffers.events.push(e),
            events
          );
        }
        function enqueueTrackEvent(e) {
          return (
            (e.url = pendo.url.externalizeURL(e.url)),
            eventsCanAddEvent(events, e) && pendo.buffers.trackEvents.push(e),
            trackEvents
          );
        }
        function eventIsWhitelisted(e) {
          return getPendoConfigValue("freeNPSData")
            ? pendo._.contains(WHITELIST_FREE_NPS, e.type)
            : !0;
        }
        function eventsCanAddEvent(e, t) {
          return eventIsWhitelisted(t) && isURLValid(t.url);
        }
        function aggregateEvents(e) {
          return pendo._.reduce(
            e,
            function(e, t) {
              var n = e.pop() || [];
              return e.push.apply(e, silosContainingEvent(n, t)), e;
            },
            silos
          );
        }
        function aggregateTrackEvents(e) {
          return pendo._.reduce(
            e,
            function(e, t) {
              var n = e.pop() || [];
              return e.push.apply(e, silosContainingEvent(n, t)), e;
            },
            trackEventSilos
          );
        }
        function tooManyBytes(e) {
          return e > SILO_MAX_BYTES;
        }
        function eventAddBytes(e) {
          return null == e.bytes && (e.bytes = JSON.stringify(e).length), e;
        }
        function siloAddBytes(e) {
          return (
            null == e.bytes &&
              (e.bytes = pendo._.reduce(
                e,
                function(e, t) {
                  return e + eventAddBytes(t).bytes;
                },
                0
              )),
            e
          );
        }
        function siloCanAddEvent(e, t) {
          return e.length
            ? !e.full &&
                !tooManyBytes(siloAddBytes(e).bytes + eventAddBytes(t).bytes)
            : !0;
        }
        function siloAddEvent(e, t) {
          return (
            (siloAddBytes(e).bytes += eventAddBytes(t).bytes), e.push(t), e
          );
        }
        function siloMarkFull(e) {
          return (e.full = !0), e;
        }
        function silosContainingEvent(e, t) {
          var n = siloAddBytes([]);
          return (
            siloAddBytes(e),
            eventAddBytes(t),
            siloCanAddEvent(e, t)
              ? [siloAddEvent(e, t)]
              : [siloMarkFull(e), siloAddEvent(n, t)]
          );
        }
        function transmitSilos(e) {
          return pendo._.reduce(
            e,
            function(e, t) {
              return e.push(t), e;
            },
            beacons
          );
        }
        function beaconWritePost(e) {
          var t = function() {
            return e;
          };
          return postEvent(e.JZB, "ptm").then(t, t);
        }
        function beaconWriteImages(e) {
          var t = function() {
            return e;
          };
          return e[0] && "track" === e[0].type
            ? writeTrackEvent(e.JZB, "ptm").then(t, t)
            : writeEvent(e.JZB, "ptm").then(t, t);
        }
        function beaconTrimUrl(e) {
          var t = e[0],
            n = t.url;
          return (
            debug("Max length exceeded for an event"),
            n && n.length > URL_MAX_LENGTH
              ? (debug("shortening the URL and retrying"),
                (t.url = limitURLSize(URL_MAX_LENGTH, n)),
                q.reject([e.slice()]))
              : (debug("Couldn't write event"),
                q
                  .all([
                    writeMessage(
                      "Single item is: " + e.JZB.length + ". Dropping."
                    ),
                    writeErrorPOST(e.JZB)
                  ])
                  .then(q.resolve(e)))
          );
        }
        function beaconWrite(e) {
          if (!isUnlocked()) return q.resolve(e);
          if (0 === e.length) return q.resolve(e);
          var t = 1 === e.length,
            n = e.JZB.length > ENCODED_EVENT_MAX_LENGTH,
            i = e.JZB.length > ENCODED_EVENT_MAX_POST_LENGTH;
          if (!n) return beaconWriteImages(e);
          if (t) {
            if (i) return beaconTrimUrl(e);
            if (n) return beaconWritePost(e);
          }
          return q.reject([e.splice(0, e.length / 2), e.slice()]);
        }
        function beaconCompress(e) {
          return e.JZB || (e.JZB = pendo.squeezeAndCompress(e.slice())), e;
        }
        function beaconTransmit(e) {
          return (e.TX = q
            .resolve(beaconWrite(beaconCompress(e)))
            .then(addToHistory, transmitSilos));
        }
        function writeBeacons(e) {
          return q.all(pendo._.map(e, beaconTransmit));
        }
        function getHtmlAttributeTester(e) {
          if (_.isRegExp(e)) return e;
          if (_.isArray(e)) {
            var t = _.map(_.filter(e, _.isObject), function(e) {
              if (e.regexp) {
                var t = /\/([a-z]*)$/.exec(e.value),
                  n = (t && t[1]) || "";
                return new RegExp(
                  e.value.replace(/^\//, "").replace(/\/[a-z]*$/, ""),
                  n
                );
              }
              return new RegExp("^" + e.value + "$", "i");
            });
            return {
              test: function(e) {
                return _.any(t, function(t) {
                  return t.test(e);
                });
              }
            };
          }
          return {
            test: function() {
              return !1;
            }
          };
        }
        function isHighSurrogate(e) {
          return e >= 55296 && 56319 >= e;
        }
        function isLowSurrogate(e) {
          return e >= 56320 && 57343 >= e;
        }
        function trimSurrogate(e) {
          if (e.length < 1) return e;
          var t = e.slice(-1).charCodeAt(0);
          if (!isHighSurrogate(t) && !isLowSurrogate(t)) return e;
          if (1 === e.length) return e.slice(0, -1);
          if (isHighSurrogate(t)) return e.slice(0, -1);
          if (isLowSurrogate(t)) {
            var n = e.slice(-2).charCodeAt(0);
            if (!isHighSurrogate(n)) return e.slice(0, -1);
          }
          return e;
        }
        function getText(e, t) {
          var n,
            i = "",
            r = e.nodeType;
          if (
            r === nodeTypeEnum.TEXT_ELEMENT ||
            r === nodeTypeEnum.CDATA_SECTION_NODE
          )
            return e.nodeValue;
          if (
            !isElemBlacklisted(e) &&
            (r === nodeTypeEnum.ELEMENT_NODE ||
              r === nodeTypeEnum.DOCUMENT_NODE ||
              r === nodeTypeEnum.DOCUMENT_FRAGMENT_NODE)
          )
            for (e = e.firstChild; e; e = e.nextSibling) {
              if (((n = getText(e, t - i.length)), (i + n).length >= t))
                return i + trimSurrogate(n.substring(0, t - i.length));
              i += n;
            }
          return i;
        }
        function pint(e) {
          return parseInt(e, 10);
        }
        function isString(e) {
          return "string" == typeof e;
        }
        function isDefined(e) {
          return "undefined" != typeof e;
        }
        function isUndefined(e) {
          return "undefined" == typeof e;
        }
        function isUndefined(e) {
          return "undefined" == typeof e;
        }
        function stripHash(e) {
          var t = e.indexOf("#");
          return -1 == t ? e : e.substr(0, t);
        }
        function startPoller(e, t) {
          !(function n() {
            pendo._.map(pollFns, function(e) {
              e();
            }),
              (pollTimeout = t(n, e));
          })();
        }
        function fireUrlChange() {
          lastBrowserUrl != url() &&
            ((lastBrowserUrl = url()),
            pendo._.map(urlChangeListeners, function(e) {
              e(url());
            }));
        }
        function sanitizeUrl(e) {
          return originalOptions &&
            originalOptions.sanitizeUrl &&
            _.isFunction(originalOptions.sanitizeUrl)
            ? originalOptions.sanitizeUrl(e)
            : e;
        }
        function parseQueryString(e) {
          if (!e) return "";
          var t = e.indexOf("?");
          if (0 > t) return "";
          var n = e.indexOf("#");
          return 0 > n ? e.substring(t) : t > n ? "" : e.substring(t, n);
        }
        function getTrustedOriginPattern(e) {
          return new RegExp(
            "^(" +
              _.chain(e)
                .unique()
                .map(function(e) {
                  return e.replace(/\./g, "\\.").replace(/^https?:/, "https?:");
                })
                .value()
                .join("|") +
              ")$"
          );
        }
        function Wrappable() {
          var e = {},
            t = function(e, t, n) {
              return function() {
                for (
                  var i = _.toArray(arguments), r = 0, o = t.length;
                  o > r;
                  ++r
                )
                  if (t[r].apply(this, i) === !1) return;
                var a = e.apply(this, i);
                for (
                  r = 0, o = n.length;
                  o > r && n[r].apply(this, i) !== !1;
                  ++r
                );
                return a;
              };
            };
          return (
            _.each(
              ["after", "before"],
              function(n) {
                this[n] = function(i, r) {
                  if (this[i]) {
                    var o = e[i];
                    o ||
                      ((o = e[i] = { before: [], after: [] }),
                      (this[i] = t(this[i], o.before, o.after))),
                      o[n].push(r);
                  }
                };
              },
              this
            ),
            this
          );
        }
        function RemoteFrameGuide() {
          return (
            (this.shouldBeAddedToLauncher = _.wrap(
              this.shouldBeAddedToLauncher,
              function(e) {
                return (
                  _.any(FrameController.getState(this), function(e) {
                    return e.shouldBeAddedToLauncher;
                  }) || e.apply(this, arguments)
                );
              }
            )),
            this
          );
        }
        function RemoteFrameStep(e) {
          function t(e) {
            i.lock(), FrameController.show(i, e).then(n, n);
          }
          function n() {
            i.unlock();
          }
          var i = this;
          return (
            (i.isShown = (function(e) {
              return function() {
                return (
                  e.apply(this, arguments) ||
                  FrameController.isShownInAnotherFrame(i)
                );
              };
            })(i.isShown)),
            i.before("show", function(n) {
              return FrameController.hasFrames() &&
                !FrameController.isInThisFrame(e)
                ? (t(n), !1)
                : void 0;
            }),
            i.after("show", function(n) {
              !i.isShown() &&
                FrameController.hasFrames() &&
                FrameController.isInAnotherFrame(e) &&
                t(n),
                i.isShown() && FrameController.shown(i);
            }),
            i.after("hide", function(e) {
              n(), (e && e.onlyThisFrame) || FrameController.hide(i, e);
            }),
            i
          );
        }
        function Tooltip(e) {
          if ("tooltip" === this.type) {
            var t = this;
            (t.attributes.height =
              t.attributes.height || pendo.TOOLTIP_DEFAULT_HEIGHT),
              (t.attributes.width =
                t.attributes.width || pendo.TOOLTIP_DEFAULT_WIDTH),
              (t.attributes.layoutDir = t.attributes.layoutDir || "DEFAULT"),
              (this.getTriggers = function(e) {
                var t = this,
                  n = t.getGuide(),
                  i = t.element || getElementForGuideStep(t);
                if (!i && e) return [];
                var r = t.advanceMethod || "",
                  o = r.split(",");
                if (
                  ((this.triggers = _.map(o, function(e) {
                    return new AdvanceTrigger(i, e, t);
                  })),
                  !e && n && n.isMultiStep && currentMode == OBM)
                ) {
                  var a = n.findSectionForStep(t),
                    s = n.getSubSection(a, t);
                  this.triggers = this.triggers.concat(
                    _.flatten(
                      _.map(s, function(e) {
                        return e.getTriggers ? e.getTriggers(!0) : [];
                      })
                    )
                  );
                }
                return this.triggers;
              }),
              (this.removeTrigger = function(e) {
                (this.triggers = _.without(this.triggers, e)),
                  0 === this.triggers.length && (this.triggers = null);
              }),
              (this.canShow = function() {
                return isDismissedUntilReload(t)
                  ? !1
                  : !t.isShown() &&
                      t.canShowOnPage(pendo.getCurrentUrl()) &&
                      canTooltipStepBeShown(t);
              }),
              this.after("render", function() {
                var e = this;
                if (showTooltipGuide(e, e.elements)) {
                  var t = e.element;
                  _.each(e.getTriggers(), function(e) {
                    e.add();
                  });
                  for (
                    var n = /(auto|scroll)/,
                      i = getScrollParent(t, n),
                      r = getBody();
                    i && i !== r;

                  )
                    e.attachEvent(
                      i,
                      "scroll",
                      _.throttle(_.bind(e.onscroll, e, i, n), 10)
                    ),
                      (i = getScrollParent(i, n));
                }
              }),
              (this.reposition = function() {
                var e = this,
                  t = e.attributes.width,
                  n = e.attributes.height,
                  i = e.attributes.layoutDir,
                  r = e.guideElement,
                  o = dom("._pendo-guide-container_", r),
                  a = getOffsetPosition(e.element),
                  s = getTooltipDimensions(a, n, t, i);
                o
                  .removeClass("top right bottom left")
                  .removeClass(
                    "_pendo-guide-container-top_ _pendo-guide-container-right_ _pendo-guide-container-bottom_ _pendo-guide-container-left_"
                  )
                  .addClass(s.arrowPosition)
                  .addClass("_pendo-guide-container-" + s.arrowPosition + "_"),
                  dom(
                    "._pendo-guide-arrow_,._pendo-guide-arrow-border_",
                    r
                  ).remove(),
                  buildAndAppendArrow(r, s),
                  r.css({
                    top: s.top,
                    left: s.left,
                    height: s.height,
                    width: s.width,
                    position: a.fixed ? "fixed" : ""
                  }),
                  (e.dim = s);
              }),
              (this.onscroll = function(e, t) {
                var n = this,
                  i = getClientRect(n.element),
                  r = n.dim;
                isVisibleInScrollParent(i, e, t)
                  ? ((r = getTooltipDimensions(
                      i,
                      n.attributes.height,
                      n.attributes.width,
                      r.arrowPosition
                    )),
                    setStyle(
                      n.elements[0],
                      "display:block;top:" + r.top + "px;left:" + r.left + "px"
                    ),
                    (n.dim = r))
                  : setStyle(n.elements[0], "display:none");
              }),
              (this.teardownElementEvent = function() {
                _.each(this.triggers, function(e) {
                  e.remove();
                });
              }),
              this.after("hide", function() {
                dom("._pendo-guide-tt-region-block_").remove(),
                  (lastBlockBox = null),
                  (lastBodySize = null),
                  (lastScreenCoords = null);
              });
          }
          return this;
        }
        function Lightbox() {
          var e = this;
          return (
            /lightbox/i.test(e.type) &&
              ((e.attributes.height =
                e.attributes.height || pendo.LB_DEFAULT_HEIGHT),
              (e.attributes.width =
                e.attributes.width || pendo.LB_DEFAULT_WIDTH),
              e.after("render", function() {
                isMobileUserAgent()
                  ? showMobileLightboxGuide(e, e.elements)
                  : showLightboxGuide(e, e.elements);
              }),
              (e.reposition = function() {
                isMobileUserAgent() ||
                  e.guideElement.css({
                    "margin-left": -Math.floor(e.attributes.width / 2),
                    "margin-top": -Math.floor(e.attributes.height / 2)
                  });
              })),
            e
          );
        }
        function Banner() {
          var e = this;
          return (
            "banner" === e.type &&
              ((e.attributes.height =
                e.attributes.height || BANNER_DEFAULT_HEIGHT),
              (e.attributes.position = e.attributes.position || "top"),
              e.after("render", function() {
                var t = e.guideElement,
                  n = pendo.TOOLTIP_ARROW_SIZE;
                t
                  .css({ width: "" })
                  .addClass(BANNER_CSS_NAME)
                  .addClass(
                    "_pendo-guide-banner-" + e.attributes.position + "_"
                  ),
                  isPreviewing() || t.addClass("_pendo-in_"),
                  dom("._pendo-guide-container_", t).css({
                    bottom: n,
                    right: n
                  }),
                  (e.element = getElementForGuideStep(e)),
                  e.elements.push(t[0]),
                  t.appendTo(getBody());
              })),
            e
          );
        }
        function WhatsNew(e) {
          function t() {
            return !!s.guideElement;
          }
          function n() {
            var t = s.guideElement;
            t &&
              !isInDocument(t[0]) &&
              (dom("._pendo-launcher_ #launcher-" + s.guideId)
                .html("")
                .append(t),
              _.isFunction(s.script) && s.script(s, e));
          }
          function i() {
            var e = s.guideElement,
              t = s.attributes.height;
            (e && e.html()) ||
              ((e = dom("<div>")
                .attr("id", getStepDivId(s))
                .addClass("_pendo-guide-whatsnew_")
                .html(s.getContent())),
              _.isNumber(t) && !s.attributes.autoHeight && e.height(t),
              s.seenState === l && e.addClass(u),
              (s.guideElement = e));
          }
          function r() {
            isPreviewing() ||
              (t() &&
                s.seenState !== l &&
                o(s.guideElement[0]) &&
                (seenGuide(
                  s.guideId,
                  s.id,
                  pendo.get_visitor_id(),
                  d,
                  e.language
                ),
                (s.seenState = l),
                _.delay(
                  function() {
                    s.guideElement.addClass(u + " out");
                  },
                  _.isNumber(s.attributes.seenDelay)
                    ? s.attributes.seenDelay
                    : c
                )));
          }
          function o(e) {
            if (isElementVisible(e, /(auto|scroll|hidden)/)) {
              var t = getScrollParent(e),
                n = getClientRect(t),
                i = getClientRect(e),
                r = n.top + Math.floor(n.height / 3);
              return i.bottom <= n.bottom || i.top <= r;
            }
          }
          function a() {}
          var s = this,
            d = "whatsnew",
            u = "_pendo-guide-whatsnew-seen_",
            l = "active",
            c = 1e3;
          return (
            s.type === d &&
              (_.extend(s, {
                isShown: _.constant(!1),
                launch: a,
                onShown: a,
                render: i,
                seen: r
              }),
              _.extend(e, { addToLauncher: n, isReady: t }),
              s.after("show", r)),
            s
          );
        }
        function Poll(e) {
          var t = this;
          if (t.pollIds && t.pollIds.length) {
            var n,
              i = "_pendo-poll-selected_",
              r = _.indexBy(e.polls, "id"),
              o = _.map(t.pollIds, function(e) {
                return r[e];
              }),
              a = function(e, t) {
                return e && t !== undefined
                  ? e.numericResponses
                    ? parseInt(t, 10)
                    : t
                  : void 0;
              },
              s = function() {
                var n = e.id,
                  i = t.id;
                advancedGuide(
                  n,
                  i,
                  pendo.get_visitor_id(),
                  t.seenReason,
                  e.language
                ),
                  _updateGuideStepStatus(n, i, "advanced"),
                  (lastGuideStepSeen = {
                    guideId: n,
                    guideStepId: i,
                    time: new Date().getTime(),
                    state: "advanced"
                  }),
                  writeLastStepSeenCache(lastGuideStepSeen);
              },
              d = function() {
                var e = dom("._pendo-poll_"),
                  n = dom("._pendo-poll-message_");
                n.length
                  ? (e.addClass("_pendo-poll-submitted_"),
                    n.css("margin-top:-" + n.height() / 2 + "px"),
                    s())
                  : t.advance();
              };
            t.after("render", function() {
              var e = Sizzle("._pendo-poll_")[0],
                n = Sizzle("._pendo-poll-submit_", e)[0];
              n
                ? t.attachEvent(n, "click", function(n) {
                    var i = Sizzle("._pendo-poll-question_", e),
                      r = _.map(i, function(e, t) {
                        var n = Sizzle(
                          "textarea,input:text,select,input:radio:checked",
                          e
                        );
                        if (n && n.length && n[0].value) {
                          var i = o[t];
                          return { pollId: i.id, value: a(i, n[0].value) };
                        }
                      });
                    t.response(_.compact(r)), d();
                  })
                : t.attachEvent(e, "click", function(e) {
                    var n = dom(getTarget(e)).closest(
                      "._pendo-poll-question_ :button,._pendo-poll-question_ :radio"
                    );
                    if (n.length) {
                      var i = o[0],
                        r = a(
                          i,
                          n.attr("data-pendo-poll-value") || n.attr("value")
                        );
                      t.response([{ pollId: i.id, value: r }]), d();
                    }
                  });
            }),
              t.after("render", function() {
                var e = Sizzle("._pendo-poll_ ._pendo-poll-npsrating_")[0],
                  n = dom("._pendo-poll_ ._pendo-poll-submit_"),
                  r = "_pendo-poll-npsrating-selected_";
                e &&
                  (n.css({ display: "none" }),
                  t.attachEvent(e, "click", function(o) {
                    var a = Sizzle(":radio:checked", e)[0],
                      s = dom("._pendo-poll_");
                    dom("label", e).removeClass(i),
                      s.removeClass(r),
                      a &&
                        (dom('label[for="' + a.id + '"]').addClass(i),
                        s.addClass(r),
                        n.css({ display: "" })),
                      _.isFunction(t.resize) && t.resize();
                  }));
              }),
              t.after("show", function() {
                n = new Date().getTime();
              }),
              (t.response = function(i, r) {
                if (i && i.length) {
                  var o = _.map(i, function(i, r) {
                    var o = createGuideEvent(
                      "pollResponse",
                      t.guideId,
                      t.id,
                      pendo.get_visitor_id(),
                      undefined,
                      e.language
                    );
                    return (
                      _.extend(o.props, {
                        poll_id: i.pollId,
                        poll_response: i.value,
                        duration: new Date().getTime() - n
                      }),
                      o
                    );
                  });
                  writeBeacon(
                    "poll",
                    _.extend(
                      {
                        ct: new Date().getTime(),
                        v: VERSION,
                        jzb: pendo.squeezeAndCompress(o)
                      },
                      r
                    )
                  );
                }
              });
          }
          return t;
        }
        function GuideStep(e) {
          var t = !1;
          return (
            (this.guide = e),
            (this.elements = []),
            (this.handlers = []),
            (this.attributes = this.attributes || {}),
            (this.getGuide = function() {
              return this.guide;
            }),
            (this.getContent = function() {
              var e = this,
                t = this.getGuide(),
                n = (t && t.steps) || [],
                i = _.indexOf(n, e),
                r = getMetadata();
              _.isObject(r) || (r = prepareOptions());
              try {
                var o = e.attributes.variables || {},
                  a = {
                    step: {
                      id: e.id,
                      isFirst: 0 === i,
                      isLast: i === n.length - 1,
                      index: i,
                      number: i + 1
                    },
                    guide: {
                      id: t.id,
                      name: t.name,
                      publishedAt: t.publishedAt,
                      showsAfter: t.showsAfter,
                      percentComplete: n.length
                        ? Math.round(((i + 1) / n.length) * 100)
                        : 0,
                      stepCount: n.length
                    },
                    metadata: escapeStringsInObject(r),
                    template: o
                  };
                return (
                  e.template || (e.template = _.template(e.content || "")),
                  replaceWithContentHost(
                    e
                      .template(a)
                      .replace(/#_pendo_g_undefined/g, "#_pendo_g_" + e.id)
                      .replace(/pendo-src="([^"]+)"/g, function(e, t) {
                        return /<%=[^>]+>/.test(t) ? e : 'src="' + t + '"';
                      })
                  )
                );
              } catch (s) {
                return e.content;
              }
            }),
            (this.isLocked = function() {
              return t;
            }),
            (this.lock = function() {
              t = !0;
            }),
            (this.unlock = function() {
              t = !1;
            }),
            (this.isShown = function() {
              return this.elements.length > 0 || this.isLocked();
            }),
            (this.canShow = function() {
              var e = this;
              return (
                !e.isShown() &&
                e.canShowOnPage(pendo.getCurrentUrl()) &&
                canStepBeRendered(e)
              );
            }),
            (this.canShowOnPage = function(e) {
              return pendo.testUrlForStep(this.regexUrlRule, e);
            }),
            (this.shouldAutoDisplay = function() {
              return !_.contains(["dismissed", "advanced"], this.seenState);
            }),
            (this.autoDisplay = function() {
              var e = this;
              e.shouldAutoDisplay() && e.show("auto");
            }),
            (this.render = function() {
              var t = this;
              if (t.domJson)
                return (
                  (t.eventRouter = new EventRouter()),
                  BuildingBlockGuides.renderGuideFromJSON(t.domJson, t)
                );
              var n = t.attributes.width,
                i = t.attributes.height,
                r = pendo.TOOLTIP_ARROW_SIZE,
                o = "_pendo-group-id-" + e.id + "_",
                a = dom("<div>")
                  .attr("id", getStepDivId(t))
                  .addClass(GUIDE_CSS_NAME + " " + o),
                s = dom("<div/>")
                  .addClass("_pendo-guide-content_")
                  .html(t.getContent()),
                d = dom("<div/>").addClass("_pendo-guide-container_");
              a.width(n),
                a.height(i),
                d.css({ left: r, top: r }),
                t.isEditable && s.attr("contenteditable", "true"),
                s.appendTo(d),
                d.appendTo(a),
                e &&
                  _.isFunction(e.isOnboarding) &&
                  e.isOnboarding() &&
                  a.addClass("_pendo-onboarding_"),
                (t.guideElement = a);
            }),
            (this.teardown = function() {
              log("guide step teardown", "guide", "render"),
                _.each(this.handlers, function(e) {
                  detachEvent(e.element, e.type, e.fn, !0);
                }),
                (this.handlers.length = 0);
            }),
            (this.show = function(t) {
              var n = this;
              e.canShowOnDevice() &&
                n.canShow() &&
                (n.render(), n.isShown() && n.onShown(t));
            }),
            (this.onShown = function(t) {
              var n = this;
              n.overrideElement && dom.addClass(n.overrideElement, "triggered"),
                isPreviewing() ||
                  ((n.seenReason = t),
                  (n.seenState = "active"),
                  (seenTime = new Date().getTime()),
                  seenGuide(
                    n.guideId,
                    n.id,
                    pendo.get_visitor_id(),
                    t,
                    e.language
                  ),
                  _.isFunction(n.script) && n.script(n, e));
            }),
            (this.hide = function(e) {
              var t = this;
              t.teardown(),
                _.each(t.elements, function(e) {
                  e.parentNode.removeChild(e);
                }),
                t.attributes &&
                  e &&
                  e.stayHidden &&
                  (t.attributes.stayHidden = e.stayHidden),
                (t.elements.length = 0),
                (t.element = null),
                (t.guideElement = null),
                t.overrideElement &&
                  dom.removeClass(t.overrideElement, "triggered"),
                removeOverlay();
            }),
            (this.advance = function() {
              "advanced" !== this.seenState && pendo.onGuideAdvanced(this);
            }),
            (this.dismiss = function() {
              "dismissed" !== this.seenState && pendo.onGuideDismissed(this);
            }),
            (this.isPoweredByEnabled = function() {
              return this.hideCredits !== !0;
            }),
            (this.attachEvent = function(e, t, n) {
              var i = { element: e, type: t, fn: n };
              attachEvent(e, t, n, !0), this.handlers.push(i);
            }),
            (this.searchFor = function(e) {
              return e.length < 3 ? !1 : strContains(this.content, e, !0);
            }),
            (this.hasBeenSeen = function() {
              return (
                "advanced" == this.seenState || "dismissed" == this.seenState
              );
            }),
            (this.reposition = function() {}),
            this
          );
        }
        function AutoHeight() {
          var e = this;
          if (e.attributes && e.attributes.autoHeight) {
            var t = function() {
              return (
                "tooltip" == e.type ||
                (isBrowserInQuirksmode() && "lightbox" == e.type)
              );
            };
            e.after("render", function() {
              e.resize(),
                e.attachEvent(e.guideElement[0], "load", function() {
                  e.resize();
                });
            }),
              (e.resize = function() {
                var n = pendo.TOOLTIP_ARROW_SIZE,
                  i = e.guideElement,
                  r = dom("._pendo-guide-container_", i);
                t()
                  ? r.css({ width: e.attributes.width - 2 * n, height: "" })
                  : r.css({ right: n, bottom: "" }),
                  (e.attributes.height = r.height() + 2 * n),
                  i.height(e.attributes.height),
                  e.reposition();
              });
          }
          return e;
        }
        function CloseButton(e) {
          var t = this;
          return t.domJson || t.domJsonpUrl
            ? t
            : (t.after("render", function() {
                addCloseButton(t.guideElement[0], function() {
                  (!e.isOnboarding() ||
                    confirm("Are you sure you want to stop this tutorial?")) &&
                    pendo.onGuideDismissed(t);
                });
              }),
              t);
        }
        function Credits() {
          var e = this;
          return (
            e.hideCredits ||
              e.domJson ||
              e.domJsonpUrl ||
              e.after("render", function() {
                pendo._addCredits(e.guideElement[0]);
              }),
            e
          );
        }
        function PreviewMode() {
          var e = this;
          return (
            e.after("render", function() {
              adjustPreviewBarPosition();
            }),
            e
          );
        }
        function WalkthroughGuide() {
          if (this.isMultiStep) {
            _.each(this.steps, function(e) {
              e.after("render", function() {
                _.each(e.elements, function(e) {
                  dom(e).addClass("_pendo-guide-walkthrough_");
                });
              });
            });
            var e = function(e, t) {
                if (!e) return !0;
                var n = _.last(e);
                return n.attributes.isRequired != t.attributes.isRequired &&
                  n.attributes.isRequired
                  ? !0
                  : !1;
              },
              t = null;
            (this.sections = _.reduce(
              this.steps,
              function(n, i) {
                return e(t, i) ? (n.push(t), (t = [i])) : t.push(i), n;
              },
              []
            )),
              (this.sections = _.compact(this.sections.concat([t]))),
              (this.findSectionForStep = function(e) {
                return _.find(this.sections, function(t) {
                  return _.contains(t, e);
                });
              }),
              (this.getSubSection = function(e, t) {
                var n = _.indexOf(e, t);
                return e.slice(n + 1);
              }),
              (this.isContinuation = function(e) {
                return !!this.nextStep(e);
              });
            var n = 432e5;
            (this.nextStep = function(e) {
              var t = null,
                i = this;
              e = e || {};
              for (var r = 0; r < i.steps.length; r++)
                if (i.steps[r].id === e.guideStepId) {
                  if ("dismissed" === e.state) break;
                  if ("active" === e.state) {
                    t = i.steps[r];
                    break;
                  }
                  if (r + 1 < i.steps.length) {
                    t = i.steps[r + 1];
                    break;
                  }
                }
              if (t) {
                var o = new Date().getTime(),
                  a = e.time;
                return a && o - a > n && !isOB(i)
                  ? (log(
                      "Multi-step continuation has expired",
                      "guides",
                      "info"
                    ),
                    null)
                  : t;
              }
              return null;
            }),
              (this.shouldAutoDisplay = function() {
                var e = this,
                  t = e.nextStep(lastGuideStepSeen) || _.first(e.steps);
                return e.hasLaunchMethod("auto") && t && t.shouldAutoDisplay();
              }),
              (this.autoDisplay = function() {
                var e = this;
                if (e.shouldAutoDisplay()) {
                  var t = e.nextStep(lastGuideStepSeen) || _.first(e.steps);
                  t.autoDisplay();
                }
              }),
              (this.launch = function(e) {
                var t = _.first(this.steps);
                t.show(e);
              }),
              (this.show = function(e) {
                var t = this,
                  n = t.nextStep(lastGuideStepSeen) || _.first(t.steps);
                n.show(e);
              }),
              (this.isComplete = function() {
                var e = ["advanced", "dismissed"],
                  t = _.last(this.steps);
                return t ? _.contains(e, t.seenState) : !1;
              }),
              (this.activeStep = function() {
                var e = [].concat(this.steps).reverse();
                return _.findWhere(e, { seenState: "active" });
              });
          }
          return this;
        }
        function GroupGuide() {
          var e = this;
          return (
            e.attributes &&
              "group" == e.attributes.type &&
              (e.checkForHiddenGroupSteps = function() {
                _.each(e.steps, function(e) {
                  e.isShown() || e.autoDisplay();
                });
              }),
            e
          );
        }
        function GuideErrorThrottle() {
          function e(e) {
            var n = [];
            return function(i) {
              try {
                return i.apply(t, _.toArray(arguments).slice(1));
              } catch (r) {
                var o = 5,
                  a = "ERROR in guide " + e + ' (ID="' + t.id + '")';
                if ((n.push(getNow()), n.length >= o)) {
                  var s = _.last(n) - _.first(n),
                    d = s > 0 ? (n.length - 1) / (s / 6e4) : 1 / 0;
                  if (d >= GuideErrorThrottle.MAX_ERRORS_PER_MINUTE) {
                    a = "Exceeded error rate limit, dropping guide.\n" + a;
                    var u = getActiveGuides(),
                      l = _.indexOf(u, t);
                    l >= 0 && u.splice(l, 1);
                  }
                  n.shift();
                }
                throw (writeException(r, a), r);
              }
            };
          }
          var t = this;
          return (
            _.each(["canShow", "placeBadge", "show"], function(n) {
              t[n] = _.wrap(t[n], e(n));
            }),
            t
          );
        }
        function Guide() {
          if (
            ((this.elements = []),
            (this.attributes = this.attributes || {}),
            this.attributes.device && this.attributes.device.type)
          )
            if ("all" == this.attributes.device.type)
              this.attributes.device = { desktop: !0, mobile: !0 };
            else {
              var e = this.attributes.device.type;
              (this.attributes.device = { mobile: !1, desktop: !1 }),
                (this.attributes.device[e] = !0);
            }
          else this.attributes.device = this.attributes.device || {};
          _.each(
            this.steps,
            function(e) {
              "mobile-lightbox" === e.type &&
                ((this.attributes.device.desktop = !1),
                (this.attributes.device.mobile = !0)),
                GuideStep.create(e, this);
            },
            this
          ),
            (this.isActivatedByEvent = function(e) {
              var t = this;
              return !!(
                t.hasLaunchMethod("dom") &&
                t.attributes &&
                t.attributes.activation &&
                _.contains(t.attributes.activation.event, e) &&
                this.canEventActivatedGuideBeShown()
              );
            }),
            (this.isContinuation = function(e) {
              return !1;
            }),
            (this.isGuideWidget = function() {
              var e = this;
              return e.attributes && "launcher" === e.attributes.type;
            }),
            (this.isOnboarding = function() {
              var e = this;
              return e.attributes && !!e.attributes.isOnboarding;
            }),
            (this.isWhatsNew = function() {
              var e = _.first(this.steps);
              return e && "whatsnew" === e.type;
            }),
            (this.isHelpGuide = function() {
              return (
                !this.isOnboarding() &&
                !this.isWhatsNew() &&
                !this.isGuideWidget()
              );
            }),
            (this.nextStep = function(e) {
              return null;
            }),
            (this.hasLaunchMethod = function(e) {
              return this.launchMethod && this.launchMethod.indexOf(e) >= 0;
            }),
            (this.shouldAutoDisplay = function() {
              var e = this;
              return (
                e.hasLaunchMethod("auto") &&
                _.any(e.steps, function(e) {
                  return e.shouldAutoDisplay();
                })
              );
            }),
            (this.autoDisplay = function() {
              var e = this;
              e.shouldAutoDisplay() &&
                _.each(e.steps, function(e) {
                  e.autoDisplay();
                });
            }),
            (this.isShown = function() {
              return _.any(this.steps, function(e) {
                return e.isShown();
              });
            }),
            (this.canShowOnDevice = function() {
              var e = this;
              if (!isPreviewing()) {
                var t = isMobileUserAgent(),
                  n = !t,
                  i = (e.attributes && e.attributes.device) || {};
                if (n && i.desktop === !1) return !1;
                if (t && i.mobile !== !0) return !1;
              }
              return !0;
            }),
            (this.canShow = function() {
              var e = this;
              return (
                e.canShowOnDevice() &&
                _.any(e.steps, function(e) {
                  return e.canShow();
                })
              );
            }),
            (this.launch = function(e) {
              var t = this;
              t.show(e),
                t.isShown() &&
                  _.each(t.steps, function(e) {
                    e.seenState = "active";
                  });
            }),
            (this.show = function(e) {
              var t = this;
              _.each(t.steps, function(t) {
                t.show(e);
              });
            }),
            (this.checkForHiddenGroupSteps = function() {}),
            (this.hide = function(e) {
              var t = this;
              _.each(t.steps, function(t) {
                t.hide(e);
              });
            }),
            (this.hasBeenSeen = function() {
              var e = this;
              return _.all(e.steps, function(e) {
                return e.hasBeenSeen();
              });
            }),
            (this.canBadgeBeShown = function() {
              var e = this.attributes.badge;
              return e && e.isOnlyShowOnce && this.hasBeenSeen() ? !1 : !0;
            }),
            (this.placeBadge = function() {
              if (
                this.canShowOnDevice() &&
                this.hasLaunchMethod("badge") &&
                this.canBadgeBeShown()
              ) {
                var e = _.first(this.steps);
                e && _.isFunction(e.fetchContent) && e.fetchContent(),
                  e &&
                    _.isFunction(e.canShowOnPage) &&
                    e.canShowOnPage(pendo.getCurrentUrl()) &&
                    placeBadge(this);
              } else removeBadgeForGuide(this);
            }),
            (this.findStepById = function(e) {
              return _.find(this.steps, function(t) {
                return t.id === e;
              });
            }),
            (this.isPoweredByEnabled = function() {
              return !!_.find(this.steps, function(e) {
                return e.isPoweredByEnabled();
              });
            }),
            (this.searchFor = function(e) {
              var t = this,
                n = null;
              if (strContains(this.name, e, !0)) n = "name";
              else {
                var i = [],
                  r = !1;
                if (
                  (this.attributes &&
                    this.attributes.launcher &&
                    this.attributes.launcher.keywords &&
                    (i = this.attributes.launcher.keywords),
                  i.length > 0 &&
                    (r = _.find(i, function(t) {
                      return strContains(t.text, e, !0);
                    })),
                  r)
                )
                  n = "tag";
                else {
                  var o = _.map(this.steps, function(t) {
                      return t.searchFor(e);
                    }),
                    a = _.compact(o).length > 0;
                  a && (n = "content");
                }
              }
              return n ? { guide: t, field: n } : !1;
            }),
            (this.shouldBeAddedToLauncher = function() {
              var e = this;
              if (!e.steps || !e.steps.length) return !1;
              var t = e.steps[0];
              return (e.hasLaunchMethod("launcher") || e.isWhatsNew()) &&
                t.canShowOnPage(pendo.getCurrentUrl()) &&
                e.canShowOnDevice() &&
                canStepBeRendered(t)
                ? !0
                : !1;
            });
          var t = "PENDO_HELPER_STEP";
          return (
            (this.getPositionOfStep = function(e) {
              var n = this,
                i = _.reject(n.steps, function(e) {
                  return strContains(e.content, t);
                });
              return _.indexOf(i, e) + 1;
            }),
            (this.getTotalSteps = function() {
              var e = this,
                n = _.reject(e.steps, function(e) {
                  return strContains(e.content, t);
                });
              return n.length;
            }),
            (this.getSeenSteps = function() {
              return _.size(
                _.filter(this.steps, function(e) {
                  return e.hasBeenSeen();
                })
              );
            }),
            (this.isComplete = function() {
              var e = ["advanced", "dismissed"];
              return _.all(this.steps, function(t) {
                return _.contains(e, t.seenState);
              });
            }),
            (this.isInProgress = function() {
              var e = ["active", "advanced", "dismissed"];
              return (
                !this.isComplete() &&
                _.any(this.steps, function(t) {
                  return _.contains(e, t.seenState);
                })
              );
            }),
            (this.isNotStarted = function() {
              return !this.isInProgress() && !this.isComplete();
            }),
            (this.fetchContent = function() {
              return q.all(
                _.map(this.steps, function(e) {
                  return _.isFunction(e.fetchContent)
                    ? e.fetchContent()
                    : void 0;
                })
              );
            }),
            (this.canEventActivatedGuideBeShown = function() {
              var e = this;
              return e.attributes.dom &&
                e.attributes.dom.isOnlyShowOnce &&
                e.steps[0].hasBeenSeen()
                ? !1
                : !0;
            }),
            this
          );
        }
        function GuideFactory(e) {
          return Guide.create(e);
        }
        function AdvanceTrigger(e, t, n) {
          (this.element = e),
            "element" == t
              ? (this.method = "click")
              : "hover" == t
              ? (this.method = "mouseover")
              : (this.method = t),
            (this.step = n),
            (this.guide = n.getGuide());
        }
        function loadGlobalScript(e) {
          var t = q.defer();
          return (
            pendo.loadResource(e, function() {
              t.resolve();
            }),
            t.promise
          );
        }
        function validateGlobalScript(e, t) {
          return _.size(pendo.events._handlers.validateGlobalScript) > 0
            ? pendo.ajax
                .get(t)
                .then(function(e) {
                  return pendo.events.validateGlobalScript(e.data);
                })
                .then(function() {
                  return e(t);
                })
            : e(t);
        }
        function ignoreEmptyGlobalScript(e, t) {
          return t ? e(t) : q.resolve();
        }
        function getAssetHost() {
          var e = getPendoConfigValue("contentHost"),
            t = getProtocol() + "//";
          return e ? t + e : getOption("contentHost", t + "cdn.pendo.io");
        }
        function getDefaultCssUrl() {
          var e = getAssetHost();
          return /local\.pendo\.io/.test(e)
            ? e + "/dist/guide.css"
            : e + "/agent/releases/2.15.16/guide.css";
        }
        function replaceWithContentHost(e) {
          var t = getOption("contentHost");
          return t
            ? e
                .replace(
                  /(https:)?\/\/pendo-static-\d+\.storage\.googleapis\.com/g,
                  t
                )
                .replace(
                  /(https:)?\/\/pendo-\w+-static\.storage\.googleapis\.com/g,
                  t
                )
                .replace(/(https:)?\/\/cdn\.pendo\.io/g, t)
            : e;
        }
        function getActiveGuides() {
          return activeGuides;
        }
        function hideGuides(e) {
          _.each(getActiveGuides(), function(t) {
            _.isFunction(t.isShown) && t.isShown() && t.hide(e);
          });
        }
        function isDismissedUntilReload(e) {
          return e && e.attributes && e.attributes.stayHidden;
        }
        function dismissedGuide(e, t, n, i, r) {
          var o = createGuideEvent({
            type: "guideDismissed",
            guideId: e,
            stepId: t,
            visitorId: n,
            seen_reason: i,
            language: r
          });
          stageGuideEvent(o);
        }
        function advancedGuide(e, t, n, i, r) {
          var o = createGuideEvent({
            type: "guideAdvanced",
            guideId: e,
            stepId: t,
            visitorId: n,
            seen_reason: i,
            language: r
          });
          stageGuideEvent(o);
        }
        function writeLatestDismissedAutoAtCache(e) {
          _.isFunction(e.getTime) && (e = e.getTime()),
            (pendo.latestDismissedAutoAt = e),
            pendo._set_cookie("latestDismissedAutoAt", e, 1e4);
        }
        function writeFinalAdvancedAutoAtCache(e) {
          _.isFunction(e.getTime) && (e = e.getTime()),
            (pendo.finalAdvancedAutoAt = e),
            pendo._set_cookie("finalAdvancedAutoAt", e, 1e4);
        }
        function createGuideEvent(e, t, n, i, r, o) {
          var a = e;
          "object" != typeof a &&
            (a = { type: e, guideId: t, stepId: n, visitorId: i }),
            r && (a.reason = r),
            o && (a.language = o);
          var s = _.extend(
            { guide_id: a.guideId, guide_step_id: a.stepId },
            _.omit(a, "type", "guideId", "stepId", "visitorId")
          );
          return {
            type: a.type,
            visitor_id: a.visitorId,
            account_id: pendo.get_account_id(),
            browser_time: new Date().getTime(),
            url: pendo.url.externalizeURL(),
            props: s
          };
        }
        function applyTimerCache(e, t) {
          var t = parseInt(t, 10);
          return isNaN(t) || !_.isNumber(t)
            ? e
            : _.isNumber(e) && t > e
            ? t
            : _.isNumber(e)
            ? e
            : t;
        }
        function sortGuidesByPriority(e) {
          return (
            _.each(e, function(e, t) {
              e.attributes || (e.attributes = {}),
                (isNaN(e.attributes.priority) ||
                  !_.isNumber(e.attributes.priority)) &&
                  (e.attributes.priority = t);
            }),
            e.sort(function(e, t) {
              return t.attributes.priority - e.attributes.priority;
            }),
            e
          );
        }
        function saveGuideShownState(e) {
          var t = _.find(e, function(e) {
            return _.isFunction(e.isShown) && e.isShown();
          });
          if (!t) return function() {};
          var n = _.chain(t.steps)
            .filter(function(e) {
              return e.isShown();
            })
            .indexBy("id")
            .value();
          return function(e) {
            var i = _.findWhere(e, { id: t.id });
            i &&
              _.each(i.steps, function(e) {
                var t = n[e.id];
                t &&
                  ((e.seenState && "active" !== e.seenState) ||
                    e.show(t.seenReason));
              });
          };
        }
        function loadExternalCss(e, t) {
          var n = document.getElementById(e);
          if (n && n.href && n.href.indexOf(t) >= 0) return q.resolve();
          var i = q.defer();
          dom(n).remove();
          var r = pendo.loadResource(t + "?ct=" + getNow(), function() {
            i.resolve();
          });
          return (r.id = e), i.promise;
        }
        function loadGuideCss() {
          var e = [];
          e.push(loadExternalCss("_pendo-default-css_", getDefaultCssUrl()));
          var t = pendo.guideWidget || {},
            n = t.data || {},
            i = n.guideCssUrl,
            r = "_pendo-css_";
          return (
            i
              ? e.push(loadExternalCss(r, replaceWithContentHost(i)))
              : dom("#" + r).remove(),
            q.all(e)
          );
        }
        function attachGuideEventHandlers() {
          var e = "click",
            t = "mouseover",
            n = "dblclick",
            i = createDomActivationHandler(e),
            r = _.throttle(createDomActivationHandler(t), 100, {
              trailing: !1
            }),
            o = createDomActivationHandler(n);
          return (
            attachEvent(document, e, i, !0),
            attachEvent(document, t, r, !0),
            attachEvent(document, n, o, !0),
            function() {
              detachEvent(document, e, i, !0),
                detachEvent(document, t, r, !0),
                detachEvent(document, n, o, !0);
            }
          );
        }
        function prefetchDomActivatedGuideContent(e) {
          _.each(e, function(e) {
            _.isFunction(e.hasLaunchMethod) &&
              e.hasLaunchMethod("dom") &&
              e.steps &&
              e.steps.length &&
              _.isFunction(e.steps[0].fetchContent) &&
              e.steps[0].fetchContent();
          });
        }
        function createDomActivationHandler(e) {
          function t(t, n) {
            var i = { click: "element", hover: "mouseover" }[e] || e;
            if (!t.advanceMethod || t.advanceMethod.indexOf(i) < 0) return !1;
            if (!t.elementPathRule || !t.element) return !1;
            var r = t.element || Sizzle(t.elementPathRule)[0];
            return r && (r === n || Sizzle.contains(r, n));
          }
          return function(n) {
            if (!areGuidesDisabled() && !areGuidesDelayed()) {
              var i = getTarget(n),
                r = _.chain(getActiveGuides())
                  .filter(function(e) {
                    return e.steps && e.steps.length;
                  })
                  .filter(function(t) {
                    return (
                      _.isFunction(t.isActivatedByEvent) &&
                      t.isActivatedByEvent(e)
                    );
                  })
                  .find(function(e) {
                    var t = e.attributes.activation.selector
                      ? e.attributes.activation.selector
                      : e.steps[0].elementPathRule;
                    return t && dom(i).closest(t).length;
                  })
                  .value();
              if (r) {
                var o = _.first(r.steps);
                o.isShown()
                  ? !AdvanceTrigger.shouldAttachHandler(r, e) &&
                    t(o, i) &&
                    o.advance()
                  : showGuide(o, "dom");
              }
            }
          };
        }
        function startPreviewMode(e) {
          if (!detectMaster()) {
            var t =
              findUrlPreviewConfig(e.location.search) ||
              findStoredPreviewConfig(pendoLocalStorage);
            if (t) {
              var n = document.getElementById(pendoPreview);
              return n
                ? !0
                : (pendoLocalStorage &&
                    _.isFunction(pendoLocalStorage.setItem) &&
                    pendoLocalStorage.setItem(
                      pendoPreview,
                      JSON.stringify(_.extend(t, { apiKey: pendo.apiKey }))
                    ),
                  _.isFunction(e.addEventListener) &&
                    e.addEventListener("message", previewMessageHandler),
                  getBody().appendChild(createPreviewBar()),
                  !0);
            }
          }
        }
        function launchPreviewListener(e) {
          e &&
            e.data &&
            e.data.type === pendoPreview + "::launch" &&
            (pendoLocalStorage.setItem(
              pendoPreview,
              JSON.stringify(
                _.extend(
                  { apiKey: pendo.apiKey, origin: e.origin },
                  e.data.config
                )
              )
            ),
            startPreviewMode(window) &&
              (e.source.postMessage(
                {
                  type: pendoPreview + "::ready",
                  apiKey: pendo.apiKey,
                  accountId: pendo.accountId
                },
                "*"
              ),
              forceGuideReload()));
        }
        function restartPreview(e) {
          hideGuides();
          var t = e[0],
            n = t.steps[0];
          return (
            (n.seenState = null),
            { guideId: t.id, guideStepId: n.id, state: "active" }
          );
        }
        function resizePreview(e) {
          var t = document.getElementById(pendoPreview);
          t && (t.style.height = e);
        }
        function previewMessageHandler(e) {
          var t = e.data.type;
          t === pendoPreview + "::exit"
            ? exitPreviewMode()
            : t === pendoPreview + "::restart"
            ? (lastGuideStepSeen = restartPreview(activeGuides))
            : t === pendoPreview + "::resize" && resizePreview(e.data.height);
        }
        function isInPreviewMode() {
          try {
            return !!findStoredPreviewConfig(pendoLocalStorage);
          } catch (e) {
            return !1;
          }
        }
        function setPreviewState(e, t) {
          var n = findStoredPreviewConfig(t);
          n &&
            ((n.state = e),
            t &&
              _.isFunction(t.setItem) &&
              t.setItem(pendoPreview, JSON.stringify(n)));
        }
        function getPreviewState(e) {
          var t = findStoredPreviewConfig(e);
          if (t) return t.state;
        }
        function createPreviewBar() {
          var e = document.createElement("iframe");
          return (
            (e.id = pendoPreview),
            (e.src = "about:blank"),
            _.extend(e.style, {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "60px",
              border: "none",
              "z-index": 4e5
            }),
            (e.onload = function() {
              var t = document.createElement("script");
              (t.src =
                getAssetHost() +
                "/agent/releases/2.15.16/pendo.preview.min.js"),
                e.contentDocument.body.appendChild(t);
            }),
            e
          );
        }
        function preparePreviewGuide(e, t) {
          var n = findStoredPreviewConfig(pendoLocalStorage);
          if (!n) return t;
          var i = _.map(
            _.filter(t, function(e) {
              return e.id === n.guideId;
            }),
            function(e) {
              return (
                _.each(e.steps, function(e) {
                  e.seenState = e.id === n.stepId ? null : "advanced";
                }),
                (e.launchMethod = "auto"),
                e
              );
            }
          );
          return i;
        }
        function preparePreviewLastGuideStepSeen(e, t) {
          var n = findStoredPreviewConfig(pendoLocalStorage);
          return n
            ? { guideId: n.guideId, guideStepId: n.stepId, state: "active" }
            : t;
        }
        function updatePreview(e, t, n) {
          var i = e.getElementById(pendoPreview);
          if (i && i.contentWindow) {
            if (!t || !t.length)
              return void i.contentWindow.postMessage(
                {
                  action: "preview/setError",
                  payload: { error: "guideNotFound" }
                },
                "*"
              );
            var r = t[0],
              o = 0,
              a = r.steps.length;
            _.find(r.steps, function(e, t) {
              return n.guideStepId !== e.id
                ? !1
                : ((o =
                    "dismissed" === n.state
                      ? a
                      : "active" === n.state
                      ? t + 1
                      : t + 2),
                  !0);
            });
            var s = r.steps[o - 1];
            i.contentWindow.postMessage(
              {
                action: "preview/updateGuideName",
                payload: { guideName: r.name }
              },
              "*"
            ),
              i.contentWindow.postMessage(
                {
                  action: "preview/updateGuideProgress",
                  payload: {
                    stepId: s && s.id,
                    currentStep: Math.max(1, Math.min(o, a)),
                    stepCount: a,
                    completed: "dismissed" === n.state || o > a
                  }
                },
                "*"
              ),
              checkForGuidePreviewError(s, i);
          }
        }
        function adjustPreviewBarPosition() {
          var e = document.getElementById(pendoPreview);
          if (e) {
            var t = _.first(Sizzle('[id^="pendo-g-"]'));
            if (t) {
              var n = getComputedStyle_safe(t);
              n &&
                ("fixed" === n.position && "0px" === n.top
                  ? ((e.style.top = "auto"), (e.style.bottom = 0))
                  : ((e.style.top = 0), (e.style.bottom = "auto")));
            }
          }
        }
        function checkForGuidePreviewError(e, t) {
          if (e) {
            if (isGuideShown())
              return void t.contentWindow.postMessage(
                { action: "preview/clearError" },
                "*"
              );
            if (
              _.isFunction(e.canShowOnPage) &&
              !e.canShowOnPage(pendo.getCurrentUrl())
            )
              return void t.contentWindow.postMessage(
                {
                  action: "preview/setError",
                  payload: { error: "pageMismatch" }
                },
                "*"
              );
            if (e.elementPathRule) {
              var n = _.first(pendo.Sizzle(e.elementPathRule));
              if (!n)
                return void t.contentWindow.postMessage(
                  {
                    action: "preview/setError",
                    payload: { error: "elementNotFound" }
                  },
                  "*"
                );
              if (!isElementVisible(n))
                return void t.contentWindow.postMessage(
                  {
                    action: "preview/setError",
                    payload: { error: "elementNotVisible" }
                  },
                  "*"
                );
            }
          }
        }
        function exitPreviewMode() {
          pendoLocalStorage &&
            _.isFunction(pendoLocalStorage.removeItem) &&
            pendoLocalStorage.removeItem(pendoPreview),
            buffersClearAll(),
            dom("#" + pendoPreview).remove(),
            forceGuideReload(),
            window.close();
        }
        function parsePreviewToken(e) {
          try {
            return JSON.parse(atob(decodeURIComponent(e)));
          } catch (t) {}
        }
        function findUrlPreviewConfig(e) {
          var t = _.map(e.replace(/^\?/, "").split("&"), function(e) {
              return e.split("=");
            }),
            n = _.find(t, function(e) {
              return e[0] === pendoPreview;
            });
          return n ? parsePreviewToken(n[1]) : void 0;
        }
        function findStoredPreviewConfig(e) {
          try {
            var t = JSON.parse(e.getItem(pendoPreview));
            if (t.apiKey === pendo.apiKey) return t;
          } catch (n) {}
        }
        function previewGuideRequest(e) {
          return pendo
            .ajax({ url: e.origin + e.guideUrl, withCredentials: !0 })
            .then(function(e) {
              return (
                (pendo.guides = [e.data.guide]),
                (pendo.guideWidget = {
                  enabled: !1,
                  data: { guideCssUrl: e.data.guideCssUrl }
                }),
                (pendo.guideCssUrl = e.data.guideCssUrl),
                e
              );
            });
        }
        function previewGuideLoaderWrapper(e, t) {
          return {
            buildUrl: e.buildUrl,
            load: function(n, i) {
              var r = findStoredPreviewConfig(t);
              return r && r.guideUrl
                ? previewGuideRequest(r).then(i)
                : e.load(n, i);
            }
          };
        }
        function guideShowingProc() {
          var e = getActiveGuide();
          _.each(e.steps, function(t) {
            stepShowingProc(e.guide, t);
          }),
            e.guide.checkForHiddenGroupSteps();
        }
        function stepShowingProc(e, t) {
          if (!t.isLocked() && !FrameController.isShownInAnotherFrame(t)) {
            var n = t.element,
              i = dom("." + GUIDE_CSS_NAME);
            if (n && (isElementVisible(n) || i.hasClass("mouseover"))) {
              if (("tooltip" == t.type && placeTooltip(t), t.domJson)) {
                if ("tooltip" === t.attributes.calculatedType) {
                  var r = BuildingBlockGuides.findGuideContainerJSON(t.domJson),
                    o = dom("#" + r.props.id);
                  pendo.BuildingBlocks.BuildingBlockTooltips.placeBBTooltip(
                    t,
                    o[0]
                  );
                }
                t.attributes.blockOutUI &&
                  t.attributes.blockOutUI.enabled &&
                  pendo.BuildingBlocks.BuildingBlockGuides.updateBackdrop(t);
              }
            } else
              ("tooltip" === t.type && wouldBeVisibleAfterAutoScroll(n)) ||
                t.hide();
          }
        }
        function Badge(e, t) {
          var n,
            i = getElementForBadge(t);
          if ("building-block" === e.attributes.type) {
            var r = pendo.buildNodeFromJSON(this.domJson)[0];
            (n = r.parentNode.removeChild(r)), n.classList.add("_pendo-badge_");
          } else {
            (n = document.createElement("img")),
              (n.src = replaceWithContentHost(this.imageUrl)),
              (n.className = "_pendo-badge " + BADGE_CSS_NAME);
            var o = this.width || 13,
              a = this.height || 13,
              s = "width:" + o + "px;height:" + a + "px;";
            setStyle(n, s);
          }
          return (
            (n.id = "_pendo-badge_" + t.id),
            (this.activate = function() {
              t.isShown() ? t.advance() : showGuide(t, "badge");
            }),
            (this.show = function() {}),
            (this.hide = function() {
              n && n.parentNode && n.parentNode.removeChild(n);
            }),
            (this.step = _.constant(t)),
            (this.target = _.constant(i)),
            (this.element = _.constant(n)),
            this
          );
        }
        function InlinePosition() {
          return (
            "inline" === this.position &&
              this.before("show", function() {
                var e = this.target(),
                  t = this.element();
                if ((this.css && setStyle(t, this.css), e && e.tagName)) {
                  var n = e.tagName.toLowerCase();
                  if (/br|input|img|select|textarea/.test(n)) {
                    if (t.parentNode === e.parentNode) return;
                    e.parentNode.insertBefore(t, e.nextSibling);
                  } else t.parentNode !== e && e.appendChild(t);
                }
              }),
            this
          );
        }
        function AbsolutePosition() {
          return (
            (this.position &&
              "top-right" !== this.position &&
              "top-left" !== this.position) ||
              this.before("show", function() {
                var e = this.element(),
                  t = getOffsetPosition(this.target()),
                  n = 0,
                  i = 0,
                  r = 0;
                this.offsets &&
                  ((n = this.offsets.top || 0),
                  (i = this.offsets.right || 0),
                  (r = this.offsets.left || 0));
                var o =
                  "position:" +
                  (t.fixed ? "fixed" : "absolute") +
                  ";top:" +
                  (t.top + n) +
                  "px;";
                switch (this.position) {
                  case "top-right":
                    o += "left:" + (t.left + t.width - i) + "px";
                    break;
                  case "top-left":
                    o += "left:" + (t.left + r) + "px";
                }
                setStyle(e, o), e.parentNode || dom.getBody().appendChild(e);
              }),
            this
          );
        }
        function ClickActivation() {
          var e = this,
            t = e.element(),
            n = !1,
            i = function(t) {
              e.activate(), stopEvent(t);
            };
          return (
            e.after("show", function() {
              n || (attachEvent(t, "click", i), (n = !0));
            }),
            e.after("hide", function() {
              detachEvent(t, "click", i), (n = !1);
            }),
            e
          );
        }
        function HoverActivation() {
          var e = this,
            t = e.element(),
            n = e.step(),
            i = !1;
          if ("yes" === e.useHover || e.showGuideOnBadgeHover) {
            var r = function(e) {
                for (; e; ) {
                  if (
                    /_pendo-guide_|_pendo-guide-tt_|_pendo-backdrop_|_pendo-badge_/.test(
                      e.className
                    )
                  )
                    return !0;
                  if (/pendo-guide-container/.test(e.id)) return !0;
                  e = e.parentNode;
                }
                return !1;
              },
              o = _.throttle(
                function(e) {
                  getTarget(e) === t || r(getTarget(e)) || s();
                },
                50,
                { trailing: !1 }
              ),
              a = function(e) {
                n.isShown() || showGuide(n, "badge"),
                  attachEvent(document, "mousemove", o),
                  stopEvent(e);
              },
              s = function(e) {
                detachEvent(document, "mousemove", o), n.hide();
              };
            e.after("show", function() {
              i || (attachEvent(t, "mouseover", a), (i = !0));
            }),
              e.after("hide", function() {
                detachEvent(t, "mouseover", a),
                  detachEvent(document, "mousemove", o),
                  (i = !1);
              });
          }
          return e;
        }
        function ShowOnHover() {
          var e = this,
            t = e.element(),
            n = e.target(),
            i = !1,
            r = e.showBadgeOnlyOnElementHover || /hover/.test(e.showOnEvent);
          if (r && !isPreviewing()) {
            var o =
                "inline" === e.position
                  ? "visibility:visible;"
                  : "display:inline;",
              a =
                "inline" === e.position
                  ? "visibility:hidden;"
                  : "display:none;",
              s = function(e, i) {
                var r = getClientRect(n),
                  o = getClientRect(t),
                  a = {
                    left: Math.min(r.left, o.left),
                    top: Math.min(r.top, o.top),
                    right: Math.max(r.right, o.right),
                    bottom: Math.max(r.bottom, o.bottom)
                  },
                  s = i + document.documentElement.scrollTop;
                return (
                  e >= a.left && e <= a.right && s >= a.top && s <= a.bottom
                );
              },
              d = _.throttle(
                function(e) {
                  getTarget(e) === n ||
                    getTarget(e) === t ||
                    _hasClass(t, "triggered") ||
                    s(e.clientX, e.clientY) ||
                    l();
                },
                50,
                { trailing: !1 }
              ),
              u = function() {
                setStyle(t, o), attachEvent(document, "mousemove", d);
              },
              l = function() {
                detachEvent(document, "mousemove", d), setStyle(t, a);
              };
            e.after("show", function() {
              i || (attachEvent(n, "mouseover", u), (i = !0), l());
            }),
              e.after("hide", function() {
                i && (detachEvent(n, "mouseover", u), (i = !1)), l();
              });
          }
          return e;
        }
        function canTooltipStepBeShown(e) {
          return (
            canStepBeRendered(e) ||
            wouldBeVisibleAfterAutoScroll(getElementForGuideStep(e))
          );
        }
        function scrollToTooltip(e, t) {
          var n = getOffsetPosition(e),
            i = getOffsetPosition(t),
            r = (function(e, t) {
              var n = Math.min(e.top, t.top),
                i = Math.min(e.left, t.left),
                r = Math.max(e.top + e.height, t.top + t.height),
                o = Math.max(e.left + e.width, t.left + t.width);
              return {
                height: Math.abs(r - n),
                width: Math.abs(o - i),
                top: n,
                left: i
              };
            })(n, i);
          if (_isInViewport(r) === !1 && !i.fixed) {
            var o = getScreenDimensions(),
              a = r.top + r.height - o.height,
              s = r.left + r.width - o.width;
            (a = 0 > a ? 0 : a), (s = 0 > s ? 0 : s), window.scrollTo(s, a);
          }
        }
        function computeBlockOutOverlayPositions(e, t, n) {
          var i = {},
            r = t.top - e.top,
            o = t.left - e.left;
          (i.top = r - n),
            (i.left = o - n),
            (i.height = t.height + 2 * n),
            (i.width = t.width + 2 * n);
          var a = { left: 0, top: 0 };
          return (
            positionFixedActsLikePositionAbsolute() &&
              ((a = bodyOffset()),
              (i.left += documentScrollLeft()),
              (i.top += documentScrollTop())),
            (i.bottom = i.top + i.height),
            (i.right = i.left + i.width),
            {
              north: {
                height: Math.max(i.top, 0),
                left: -a.left,
                top: -a.top,
                right: 0
              },
              east: {
                top: i.top - a.top,
                bottom: 0,
                right: 0,
                left: i.right - a.left
              },
              south: {
                top: i.bottom - a.top,
                width: Math.max(i.right, 0),
                bottom: 0,
                left: -a.left
              },
              west: {
                top: i.top - a.top,
                height: Math.max(i.height, 0),
                left: -a.left,
                width: Math.max(i.left, 0)
              }
            }
          );
        }
        function computeBlockOutBoundingBox(e) {
          var t = _.reduce(
            e,
            function(e, t) {
              if (!isElementVisible(t)) return e;
              var n = getClientRect(t);
              return (
                (e.fixed = e.fixed && n.fixed),
                _.each(
                  [
                    ["top", isLessThan],
                    ["right", isGreaterThan],
                    ["bottom", isGreaterThan],
                    ["left", isLessThan]
                  ],
                  function(t) {
                    var i = t[0],
                      r = t[1];
                    (!e[i] || r(n[i], e[i])) && (e[i] = n[i]);
                  }
                ),
                e
              );
            },
            { fixed: !0 }
          );
          (t.height = t.bottom - t.top), (t.width = t.right - t.left);
          var n = bodyOffset();
          return (
            t.fixed ||
              ((t.left += n.left),
              (t.right += n.left),
              (t.top += n.top),
              (t.bottom += n.top)),
            (t.fixed = !!t.fixed),
            t
          );
        }
        function wouldBeVisibleAfterAutoScroll(e) {
          var t,
            n,
            i,
            r,
            o,
            a = /(auto|scroll)/,
            s = /(auto|scroll|hidden)/,
            d = getBody(),
            u = getClientRect(e),
            l = getScrollParent(e, s);
          if (!isElementVisibleInBody(e)) return !1;
          for (; l && l !== d; ) {
            if (
              ((t = getClientRect(l)),
              (o = getOverflowDirection(l, a)),
              o !== OverflowDirection.NONE &&
                ((n = 0),
                (i = 0),
                (o === OverflowDirection.Y || o === OverflowDirection.BOTH) &&
                  (u.bottom > t.bottom &&
                    ((n += u.bottom - t.bottom), (u.top -= n), (u.bottom -= n)),
                  u.top < t.top &&
                    ((r = t.top - u.top),
                    (n -= r),
                    (u.top += r),
                    (u.bottom += r))),
                (o === OverflowDirection.X || o === OverflowDirection.BOTH) &&
                  (u.right > t.right &&
                    ((i += u.right - t.right), (u.left -= i), (u.right -= i)),
                  u.left < t.left &&
                    ((r = t.left - u.left),
                    (i -= r),
                    (u.left += r),
                    (u.right += r)))),
              !isVisibleInScrollParent(u, l, s))
            )
              return !1;
            l = getScrollParent(l, s);
          }
          return !0;
        }
        function LauncherSearch() {
          function e(e) {
            return i.text
              ? (e || "").replace(
                  new RegExp(i.text, "gi"),
                  "<strong>$&</strong>"
                )
              : e;
          }
          function t() {
            dom(SEARCHBOX_CSS_SELECTOR).each(function() {
              this.value = "";
            });
          }
          var n = this,
            i = { text: "", highlight: e, clear: t };
          return (
            n.data &&
              n.data.enableSearch &&
              n.data.enableSearch &&
              ((n.data.search = i),
              pendo.disableGuideCenterContentSearch ||
                n.before("update", prefetchGuideContentForSearch),
              n.before("update", function() {
                i.text = getLauncherSearchText().join(" ");
                var e = dom("._pendo-launcher_");
                i.text
                  ? e.addClass(LAUNCHER_SEARCHING_CLASS)
                  : e.removeClass(LAUNCHER_SEARCHING_CLASS);
              })),
            n
          );
        }
        function isSearchEnabled() {
          if (!pendo.guideWidget) return !1;
          var e = pendo.guideWidget.data;
          return !!e && !!e.enableSearch;
        }
        function launcherHasActiveSearch() {
          return getLauncherSearchText().length > 0;
        }
        function getLauncherSearchText() {
          if (!isSearchEnabled()) return [];
          var e = dom(SEARCHBOX_CSS_SELECTOR)[0];
          if (!e) return [];
          var t = e.value;
          return t.length > 0
            ? ((t = trim.call(t)), [].concat(_.compact(t.split(" "))))
            : [];
        }
        function prefetchGuideContentForSearch(e) {
          return q.all(
            _.map(e, function(e) {
              return e.fetchContent();
            })
          );
        }
        function isSearchEnabled() {
          if (!pendo.guideWidget) return !1;
          var e = pendo.guideWidget.data;
          return !!e && !!e.enableSearch;
        }
        function applySearch(e) {
          var t = getLauncherSearchText();
          if (0 === t.length) return e;
          var n = _.map(t, _.partial(doSearch, e));
          return (n = _.union.apply(_, n));
        }
        function doSearch(e, t) {
          function n(e) {
            return e.searchFor(t);
          }
          function i(e) {
            var t = ["tag", "name", "content"];
            return _.indexOf(t, e.field);
          }
          return (
            log("doing search on " + t, "launcher", "search", "guides"),
            (e = e || getActiveGuides()),
            t && 0 !== t.length
              ? _.chain(e)
                  .filter(isLauncher)
                  .map(n)
                  .compact()
                  .sortBy(i)
                  .pluck("guide")
                  .value()
              : e
          );
        }
        function getLauncherGuideList(e) {
          var t = _.filter(e || getActiveGuides(), isLauncher);
          return applySearch(t);
        }
        function computeLauncherHash(e) {
          return crc32(
            _.map(e, function(e) {
              var t = e.isWhatsNew() ? [] : _.pluck(e.steps, "seenState");
              return { id: e.id, seenState: t };
            })
          );
        }
        function LauncherBadge(e) {
          function t(e) {
            var t = e.position || "bottom-right",
              n = document.createElement("img");
            (s.element = n),
              dom(n)
                .addClass("_pendo-launcher-badge_")
                .addClass("_pendo-launcher-badge-" + t + "_"),
              (n.src = replaceWithContentHost(e.launcherBadgeUrl)),
              isBrowserInQuirksmode() &&
                (attachEvent(n, "mouseover", function(e) {
                  dom(n).addClass("_pendo-launcher-badge-active_");
                }),
                attachEvent(n, "mouseout", function(e) {
                  dom(n).removeClass("_pendo-launcher-badge-active_");
                }),
                dom(n).css({ position: "absolute" })),
              dom.getBody().appendChild(n);
          }
          function n() {
            "badge" === d && dom(s.element).css("display: ;");
          }
          function i() {
            dom(s.element).css("display: none;");
          }
          function r() {
            var e = s.element;
            if (e && /^img$/i.test(e.nodeName)) {
              var t = dom("<div>")
                .addClass(e.className)
                .append(e)
                .appendTo(getBody());
              (e.className = ""), (s.element = t[0]);
            }
          }
          function o() {
            dom.removeNode(s.element);
          }
          function a(e) {
            e
              ? dom(s.element).addClass(launcherActiveClass)
              : dom(s.element).removeClass(launcherActiveClass);
          }
          var s = this,
            d = e.launchType ? e.launchType : "badge";
          _.extend(s, { show: n, hide: i, wrap: r, dispose: o, setActive: a }),
            t(e);
        }
        function LauncherElement(e) {
          function t() {
            return dom(n())[0];
          }
          function n() {
            return "element" === e.launchType && e.launchElement
              ? e.launchElement
              : "._pendo-launcher-badge_";
          }
          function i(e) {
            attachEvent(document, "click", r);
          }
          function r(e) {
            var t = getTarget(e),
              i = n(),
              r = dom(t).closest(i);
            r.length &&
              (isLauncherVisible()
                ? write("launcher-closed", "yes", 864e6)
                : pendo.guideWidget.position(t),
              toggleLauncher());
          }
          function o() {
            detachEvent(document, "click", r),
              e && e.whatsnew && e.whatsnew.enabled && removeCountBadge();
          }
          var a = this;
          (pendo.guideWidget.removeCountBadge = function() {
            dom("._pendo-launcher-whatsnew-count_").remove();
          }),
            e && e.elementMatch && (e.launchElement = e.elementMatch.selection),
            _.extend(a, { getLauncherTarget: t, dispose: o }),
            i(e);
        }
        function Launcher() {
          var e,
            t = "bottom-right",
            n = "bottom-left",
            i = "top-left",
            r = "top-right";
          return (
            (this.update = function(t, n) {
              var i;
              i = n ? t : getLauncherGuideList(t);
              var r = computeLauncherHash(i) + crc32(getLauncherSearchText());
              return (
                r !== e && ((e = r), this.updateLauncherContent(i)),
                showHideLauncher(),
                i.length > 0
              );
            }),
            (this.updateLauncherContent = updateLauncherContent),
            (this.guideStatus = function(e) {
              return e.isComplete()
                ? "complete"
                : e.isInProgress()
                ? "in-progress"
                : "not-started";
            }),
            (this.render = function() {
              var e = this.data || {};
              launcherBadge = new LauncherBadge(e);
              var t = e.height || LAUNCHER_DEFAULT_HEIGHT;
              e.enableSearch && (t += isBrowserInQuirksmode() ? 50 : 39),
                this && !this.hidePoweredBy && (t += 40),
                e.addHeight && (t += e.addHeight),
                (this.height = t);
              var n = e.width || LAUNCHER_DEFAULT_WIDTH;
              e.addWidth && (n += e.addWidth), (this.width = n);
              var i = dom("<div>").addClass("_pendo-launcher_");
              launcherTooltipDiv = i[0];
              var r = getOffsetPosition(launcherBadge.element),
                o = getTooltipDimensions(r, t, n);
              i.css({ width: n, height: t });
              var a = pendo.TOOLTIP_ARROW_SIZE,
                s = dom("<div/>")
                  .addClass("_pendo-guide-container_ " + o.arrowPosition)
                  .addClass("_pendo-guide-container-" + o.arrowPosition + "_")
                  .css({ top: a, left: a, width: n - 2 * a, height: t - 2 * a })
                  .appendTo(i),
                d = getLauncherContext(),
                u = replaceWithContentHost(
                  replaceInlineStyles(this.template(d))
                ),
                l = dom("<div/>")
                  .addClass("_pendo-guide-content_")
                  .html(u)
                  .appendTo(s);
              if (
                (e.addUISection && e.addUISection(i[0]),
                pendo._addCloseButton(i[0], function() {
                  toggleLauncher(), write("launcher-closed", "yes", 288e5);
                }),
                l.on("click", function(e) {
                  var t = dom(getTarget(e)).closest("._pendo-launcher-item_");
                  if (t && t.length) {
                    var n = /^launcher-(.+)$/.exec(trim.call(t.attr("id"))),
                      i = n && n[1],
                      r = findGuideById(i);
                    r &&
                      !r.isWhatsNew() &&
                      (showGuide(r.steps[0], "launcher"),
                      toggleLauncher(),
                      stopEvent(e));
                  }
                }),
                isBrowserInQuirksmode() &&
                  (dom("._pendo-launcher-header_", i).css({
                    padding: "10px",
                    "margin-right": "10px",
                    "margin-left": "10px"
                  }),
                  dom("._pendo-launcher-footer_", i).css({
                    "border-top": "1px solid #bbb"
                  }),
                  i.css({ position: "absolute" })),
                i.find("[pendo-style]").each(function() {
                  var e = this.getAttribute("pendo-style");
                  dom(this).css(e);
                }),
                i.appendTo(dom.getBody()),
                _.isFunction(this.script) && this.script(this),
                e.autoHeight && e.autoHeight.enabled && !isOldIE(9, 6))
              ) {
                var c = e.autoHeight.offset || 100;
                i.css({
                  height: "calc(100% - " + c + "px)",
                  maxHeight: e.height,
                  minHeight: e.height / 2
                }),
                  dom("._pendo-guide-container_." + o.arrowPosition).css({
                    maxHeight: e.height - 30,
                    minHeight: e.height / 2 - 30,
                    height: "calc(100% - 30px)"
                  });
              }
            }),
            (this.position = function(e) {
              if (e) {
                var o = this.data,
                  a = getOffsetPosition(e),
                  s = getTooltipDimensions(a, this.height, this.width),
                  d = dom(launcherTooltipDiv),
                  u = o.launchType ? o.launchType : "badge";
                if ("badge" === u) {
                  var l = o.position,
                    c = [t, n, i, r];
                  _.indexOf(c, o.position) < 0 && (l = t),
                    _.each(c, function(e) {
                      d.removeClass("_pendo-launcher-" + e + "_");
                    }),
                    d.addClass("_pendo-launcher-" + l + "_"),
                    (s.arrow = s.arrow || {}),
                    (s.arrowPosition = _.contains([t, n], l)
                      ? "bottom"
                      : "top"),
                    (s.arrow.hbias = _.contains([n, i], l) ? "left" : "right"),
                    (s.arrow.floating = !1);
                } else
                  "element" === u &&
                    d.css({
                      top: s.top,
                      left: s.left,
                      height: s.height,
                      width: s.width,
                      position: a.fixed ? "fixed" : "absolute"
                    });
                dom(
                  "._pendo-guide-arrow_,._pendo-guide-arrow-border_",
                  d
                ).remove(),
                  buildArrowDimensions(s, a, { width: 1 / 0, height: 1 / 0 }),
                  buildAndAppendArrow(d[0], s),
                  d
                    .find("._pendo-guide-container_")
                    .removeClass("top left bottom right")
                    .addClass(s.arrowPosition);
              }
            }),
            (this.toggle = toggleLauncher),
            this
          );
        }
        function Onboarding() {
          var e = this;
          if (e.data && e.data.onboarding) {
            var t = (e.onboarding = e.onboarding || {});
            e.before("update", function(n) {
              var i = _.filter(n, isOB),
                r = _.filter(i, function(t) {
                  return "complete" == e.guideStatus(t);
                }),
                o = (t.total = i.length);
              t.percentComplete = o > 0 ? Math.round((r.length / o) * 100) : 0;
              var a = dom("._pendo-launcher_,._pendo-launcher-badge_");
              o
                ? (a.addClass("onboarding"),
                  a.addClass("_pendo-launcher-onboarding_"))
                : (a.removeClass("onboarding"),
                  a.removeClass("_pendo-launcher-onboarding_"));
            }),
              (e.getOnboardingState = function(e) {
                return e.isComplete()
                  ? "complete"
                  : e.isInProgress()
                  ? "in-progress"
                  : e.isNotStarted()
                  ? "not-started"
                  : null;
              });
          }
          return e;
        }
        function WhatsNewList() {
          function e(e, i) {
            var r = t(e, i);
            return 0 === r ? n(e, i) : r;
          }
          function t(e, t) {
            var n = e.showsAfter || e.publishedAt || 0,
              i = t.showsAfter || t.publishedAt || 0;
            return i - n;
          }
          function n(e, t) {
            var n = e.name.toLowerCase(),
              i = t.name.toLowerCase();
            return n > i ? 1 : i > n ? -1 : 0;
          }
          var i = this,
            r = dom("<div>").addClass("_pendo-launcher-whatsnew-count_");
          return (
            i.data &&
              i.data.whatsnew &&
              i.data.whatsnew.enabled &&
              (i.before("updateLauncherContent", function(t) {
                var n = _.filter(t, function(e) {
                  return e.isWhatsNew();
                });
                n.sort(e),
                  (i.data.whatsnew.total = n.length),
                  (i.data.whatsnew.guides = n);
              }),
              i.after("update", function(e) {
                var t = i.data.whatsnew.guides;
                _.each(t, function(e) {
                  e.show();
                }),
                  _.find(t, function(e) {
                    return e.isReady() ? void e.addToLauncher() : !0;
                  });
                var n = _.filter(t, function(e) {
                  return "active" !== e.steps[0].seenState;
                }).length;
                n !== i.data.whatsnew.unseenCount &&
                  (r.html(n).css({ display: n ? "" : "none" }),
                  (i.data.whatsnew.unseenCount = n));
              }),
              i.after("render", function() {
                isLauncherOnElement()
                  ? r.appendTo(this.data.launchElement)
                  : (launcherBadge.wrap(), r.appendTo(launcherBadge.element));
              })),
            i
          );
        }
        function replaceInlineStyles(e) {
          return (
            _.isString(e) && (e = e.replace(/\s+(style)=/gi, " pendo-style=")),
            e
          );
        }
        function upgradeLauncher(e, t) {
          var n = e && e.data,
            i = _.find(t, function(e) {
              var t = _.first(e.steps);
              return t && "launcher" === t.type;
            });
          if (i && n) {
            var r = _.first(i.steps);
            (n.id = r.guideId + r.id),
              _.extend(
                n,
                _.pick(r, "contentUrl", "contentUrlCss", "contentUrlJs"),
                r.attributes
              );
          }
          return e;
        }
        function loadLauncherContent(e) {
          var t = (e && e.data) || {};
          return t.contentUrlJs || t.contentUrl
            ? ContentLoader.load(t).then(function(n) {
                return (t.template = n.content), _.extend(e, n);
              })
            : q.resolve();
        }
        function fixContentHostUrl(e, t) {
          var n = getOption("contentHost");
          return n
            ? ((e = e
                .replace(/^pendo-static-\d+\.storage\.googleapis\.com$/, n)
                .replace(/^pendo-\w+-static\.storage\.googleapis\.com$/, n)
                .replace(/^cdn\.pendo\.io$/, n)),
              (e = e.replace(/^https?:/, "").replace(/^\/\//, "")),
              /\./.test(e) || /^localhost/.test(e)
                ? e
                : /^\//.test(e)
                ? t.host + e
                : e)
            : e;
        }
        function createLauncher(e, t) {
          if (!isPreventLauncher) {
            e.contentHostUrl &&
              (e.contentHostUrl = fixContentHostUrl(
                e.contentHostUrl,
                location
              )),
              (launcherElement = new LauncherElement(e));
            var n = Launcher.create(pendo.guideWidget);
            return (
              _.isFunction(n.template) ||
                (n.template = e.template
                  ? _.template(e.template)
                  : defaultLauncherTemplate),
              n.render(),
              n.position(launcherElement.getLauncherTarget()),
              t && n.toggle(),
              n
            );
          }
        }
        function updateLauncherContent(e) {
          var t = pendo.guideWidget,
            n = t.template || defaultLauncherTemplate,
            i = getLauncherContext(e),
            r = dom("<div>").html(replaceInlineStyles(n(i))),
            o = r.find("._pendo-launcher-guide-listing_"),
            a = r.find("._pendo-launcher-footer_").html(),
            s = r.find("._pendo-launcher-search-results_").html();
          dom("._pendo-launcher_ ._pendo-launcher-guide-listing_").each(
            function(e, t) {
              dom(e).html(o.eq(t).html());
            }
          ),
            dom("._pendo-launcher_ ._pendo-launcher-footer_").html(a),
            dom("._pendo-launcher_ ._pendo-launcher-search-results_").html(s);
        }
        function removeCountBadge() {
          dom("._pendo-launcher-whatsnew-count_").remove();
        }
        function base32Encode(e) {
          for (
            var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
              n = e.length,
              i = 0,
              r = 0,
              o = "",
              a = 0;
            n > a;
            a++
          )
            for (r = (r << 8) | e[a], i += 8; i >= 5; )
              (o += t[(r >>> (i - 5)) & 31]), (i -= 5);
          return i > 0 && (o += t[(r << (5 - i)) & 31]), o;
        }
        function deprecateFn(e, t, n) {
          return function() {
            return memoizedWarnDep(t, n), (e || _.noop).apply(null, arguments);
          };
        }
        function isDebuggingEnabled(e) {
          e = e || !1;
          var t = "true" === readAll("debug-enabled");
          return e ? t : t ? "Yes" : "No";
        }
        function startDebuggingModuleIfEnabled() {
          isDebuggingEnabled(!0) &&
            !detectMaster() &&
            ((pendo.debugging = debugging),
            pendo.loadResource(
              getAssetHost() + "/debugger/pendo-client-debugger.js",
              function() {
                log("Debug module loaded");
              }
            ));
        }
        function enableDebugging(e) {
          return isDebuggingEnabled(!0)
            ? e
              ? debugging
              : "debugging already enabled"
            : (writeAll("debug-enabled", "true"),
              startDebuggingModuleIfEnabled(),
              e ? debugging : "debugging enabled");
        }
        function disableDebugging() {
          return isDebuggingEnabled(!0)
            ? (writeAll("debug-enabled", "false"),
              (pendo.debugging = null),
              delete pendo.debugging,
              "debugging disabled")
            : "debugging already disabled";
        }
        function debug(e) {
          log(e, "debug");
        }
        function patchJSONstringify() {
          var e = JSON.stringify;
          JSON.stringify = function(t, n, i) {
            var r = Array.prototype.toJSON;
            delete Array.prototype.toJSON;
            var o = e(t, n, i);
            return (Array.prototype.toJSON = r), o;
          };
        }
        function isPrototypeOlderThan(e) {
          return (
            "undefined" != typeof Prototype &&
            parseFloat(Prototype.Version.substr(0, 3)) < e &&
            "undefined" != typeof Array.prototype.toJSON
          );
        }
        function track(e, t) {
          var n = pendo.url.get();
          collectEvent("track", t, n, e);
        }
        function autoInitialize() {
          return isReady()
            ? void pendo.log("already running")
            : (window.pendo_options && initialize(window.pendo_options),
              flushCallQueue(),
              void flushEvery(SEND_INTERVAL));
        }
        if (!window.pendo || !window.pendo.VERSION) {
          var UNDERSCORE_EXT = {};
          (function() {
            var e = UNDERSCORE_EXT,
              t = e._,
              n = Array.prototype,
              i = Object.prototype,
              r = Function.prototype,
              o = n.push,
              a = n.slice,
              s = n.concat,
              d = i.toString,
              u = i.hasOwnProperty,
              l = Array.isArray,
              c = Object.keys,
              p = r.bind,
              f = function(e) {
                return e instanceof f
                  ? e
                  : this instanceof f
                  ? void (this._wrapped = e)
                  : new f(e);
              };
            (e._ = f), (f.VERSION = "1.7.0-pendo");
            var h = function(e, t, n) {
              if (void 0 === t) return e;
              switch (null == n ? 3 : n) {
                case 1:
                  return function(n) {
                    return e.call(t, n);
                  };
                case 2:
                  return function(n, i) {
                    return e.call(t, n, i);
                  };
                case 3:
                  return function(n, i, r) {
                    return e.call(t, n, i, r);
                  };
                case 4:
                  return function(n, i, r, o) {
                    return e.call(t, n, i, r, o);
                  };
              }
              return function() {
                return e.apply(t, arguments);
              };
            };
            (f.iteratee = function(e, t, n) {
              return null == e
                ? f.identity
                : f.isFunction(e)
                ? h(e, t, n)
                : f.isObject(e)
                ? f.matches(e)
                : f.property(e);
            }),
              (f.each = f.forEach = function(e, t, n) {
                if (null == e) return e;
                t = h(t, n);
                var i,
                  r = e.length;
                if (r === +r) for (i = 0; r > i; i++) t(e[i], i, e);
                else {
                  var o = f.keys(e);
                  for (i = 0, r = o.length; r > i; i++) t(e[o[i]], o[i], e);
                }
                return e;
              }),
              (f.map = f.collect = function(e, t, n) {
                if (null == e) return [];
                t = f.iteratee(t, n);
                for (
                  var i,
                    r = e.length !== +e.length && f.keys(e),
                    o = (r || e).length,
                    a = Array(o),
                    s = 0;
                  o > s;
                  s++
                )
                  (i = r ? r[s] : s), (a[s] = t(e[i], i, e));
                return a;
              });
            var g = "Reduce of empty array with no initial value";
            (f.reduce = f.foldl = f.inject = function(e, t, n, i) {
              null == e && (e = []), (t = h(t, i, 4));
              var r,
                o = e.length !== +e.length && f.keys(e),
                a = (o || e).length,
                s = 0;
              if (arguments.length < 3) {
                if (!a) throw new TypeError(g);
                n = e[o ? o[s++] : s++];
              }
              for (; a > s; s++) (r = o ? o[s] : s), (n = t(n, e[r], r, e));
              return n;
            }),
              (f.reduceRight = f.foldr = function(e, t, n, i) {
                null == e && (e = []), (t = h(t, i, 4));
                var r,
                  o = e.length !== +e.length && f.keys(e),
                  a = (o || e).length;
                if (arguments.length < 3) {
                  if (!a) throw new TypeError(g);
                  n = e[o ? o[--a] : --a];
                }
                for (; a--; ) (r = o ? o[a] : a), (n = t(n, e[r], r, e));
                return n;
              }),
              (f.find = f.detect = function(e, t, n) {
                var i;
                return (
                  (t = f.iteratee(t, n)),
                  f.some(e, function(e, n, r) {
                    return t(e, n, r) ? ((i = e), !0) : void 0;
                  }),
                  i
                );
              }),
              (f.filter = f.select = function(e, t, n) {
                var i = [];
                return null == e
                  ? i
                  : ((t = f.iteratee(t, n)),
                    f.each(e, function(e, n, r) {
                      t(e, n, r) && i.push(e);
                    }),
                    i);
              }),
              (f.reject = function(e, t, n) {
                return f.filter(e, f.negate(f.iteratee(t)), n);
              }),
              (f.every = f.all = function(e, t, n) {
                if (null == e) return !0;
                t = f.iteratee(t, n);
                var i,
                  r,
                  o = e.length !== +e.length && f.keys(e),
                  a = (o || e).length;
                for (i = 0; a > i; i++)
                  if (((r = o ? o[i] : i), !t(e[r], r, e))) return !1;
                return !0;
              }),
              (f.some = f.any = function(e, t, n) {
                if (null == e) return !1;
                t = f.iteratee(t, n);
                var i,
                  r,
                  o = e.length !== +e.length && f.keys(e),
                  a = (o || e).length;
                for (i = 0; a > i; i++)
                  if (((r = o ? o[i] : i), t(e[r], r, e))) return !0;
                return !1;
              }),
              (f.contains = f.include = function(e, t) {
                return null == e
                  ? !1
                  : (e.length !== +e.length && (e = f.values(e)),
                    f.indexOf(e, t) >= 0);
              }),
              (f.invoke = function(e, t) {
                var n = a.call(arguments, 2),
                  i = f.isFunction(t);
                return f.map(e, function(e) {
                  return (i ? t : e[t]).apply(e, n);
                });
              }),
              (f.pluck = function(e, t) {
                return f.map(e, f.property(t));
              }),
              (f.where = function(e, t) {
                return f.filter(e, f.matches(t));
              }),
              (f.findWhere = function(e, t) {
                return f.find(e, f.matches(t));
              }),
              (f.max = function(e, t, n) {
                var i,
                  r,
                  o = -(1 / 0),
                  a = -(1 / 0);
                if (null == t && null != e) {
                  e = e.length === +e.length ? e : f.values(e);
                  for (var s = 0, d = e.length; d > s; s++)
                    (i = e[s]), i > o && (o = i);
                } else
                  (t = f.iteratee(t, n)),
                    f.each(e, function(e, n, i) {
                      (r = t(e, n, i)),
                        (r > a || (r === -(1 / 0) && o === -(1 / 0))) &&
                          ((o = e), (a = r));
                    });
                return o;
              }),
              (f.min = function(e, t, n) {
                var i,
                  r,
                  o = 1 / 0,
                  a = 1 / 0;
                if (null == t && null != e) {
                  e = e.length === +e.length ? e : f.values(e);
                  for (var s = 0, d = e.length; d > s; s++)
                    (i = e[s]), o > i && (o = i);
                } else
                  (t = f.iteratee(t, n)),
                    f.each(e, function(e, n, i) {
                      (r = t(e, n, i)),
                        (a > r || (r === 1 / 0 && o === 1 / 0)) &&
                          ((o = e), (a = r));
                    });
                return o;
              }),
              (f.shuffle = function(e) {
                for (
                  var t,
                    n = e && e.length === +e.length ? e : f.values(e),
                    i = n.length,
                    r = Array(i),
                    o = 0;
                  i > o;
                  o++
                )
                  (t = f.random(0, o)), t !== o && (r[o] = r[t]), (r[t] = n[o]);
                return r;
              }),
              (f.sample = function(e, t, n) {
                return null == t || n
                  ? (e.length !== +e.length && (e = f.values(e)),
                    e[f.random(e.length - 1)])
                  : f.shuffle(e).slice(0, Math.max(0, t));
              }),
              (f.sortBy = function(e, t, n) {
                return (
                  (t = f.iteratee(t, n)),
                  f.pluck(
                    f
                      .map(e, function(e, n, i) {
                        return { value: e, index: n, criteria: t(e, n, i) };
                      })
                      .sort(function(e, t) {
                        var n = e.criteria,
                          i = t.criteria;
                        if (n !== i) {
                          if (n > i || void 0 === n) return 1;
                          if (i > n || void 0 === i) return -1;
                        }
                        return e.index - t.index;
                      }),
                    "value"
                  )
                );
              });
            var v = function(e) {
              return function(t, n, i) {
                var r = {};
                return (
                  (n = f.iteratee(n, i)),
                  f.each(t, function(i, o) {
                    var a = n(i, o, t);
                    e(r, i, a);
                  }),
                  r
                );
              };
            };
            (f.groupBy = v(function(e, t, n) {
              f.has(e, n) ? e[n].push(t) : (e[n] = [t]);
            })),
              (f.indexBy = v(function(e, t, n) {
                e[n] = t;
              })),
              (f.countBy = v(function(e, t, n) {
                f.has(e, n) ? e[n]++ : (e[n] = 1);
              })),
              (f.sortedIndex = function(e, t, n, i) {
                n = f.iteratee(n, i, 1);
                for (var r = n(t), o = 0, a = e.length; a > o; ) {
                  var s = (o + a) >>> 1;
                  n(e[s]) < r ? (o = s + 1) : (a = s);
                }
                return o;
              }),
              (f.toArray = function(e) {
                return e
                  ? f.isArray(e)
                    ? a.call(e)
                    : e.length === +e.length
                    ? f.map(e, f.identity)
                    : f.values(e)
                  : [];
              }),
              (f.size = function(e) {
                return null == e
                  ? 0
                  : e.length === +e.length
                  ? e.length
                  : f.keys(e).length;
              }),
              (f.partition = function(e, t, n) {
                t = f.iteratee(t, n);
                var i = [],
                  r = [];
                return (
                  f.each(e, function(e, n, o) {
                    (t(e, n, o) ? i : r).push(e);
                  }),
                  [i, r]
                );
              }),
              (f.first = f.head = f.take = function(e, t, n) {
                return null == e
                  ? void 0
                  : null == t || n
                  ? e[0]
                  : 0 > t
                  ? []
                  : a.call(e, 0, t);
              }),
              (f.initial = function(e, t, n) {
                return a.call(
                  e,
                  0,
                  Math.max(0, e.length - (null == t || n ? 1 : t))
                );
              }),
              (f.last = function(e, t, n) {
                return null == e
                  ? void 0
                  : null == t || n
                  ? e[e.length - 1]
                  : a.call(e, Math.max(e.length - t, 0));
              }),
              (f.rest = f.tail = f.drop = function(e, t, n) {
                return a.call(e, null == t || n ? 1 : t);
              }),
              (f.compact = function(e) {
                return f.filter(e, f.identity);
              });
            var m = function(e, t, n, i) {
              if (t && f.every(e, f.isArray)) return s.apply(i, e);
              for (var r = 0, a = e.length; a > r; r++) {
                var d = e[r];
                f.isArray(d) || f.isArguments(d)
                  ? t
                    ? o.apply(i, d)
                    : m(d, t, n, i)
                  : n || i.push(d);
              }
              return i;
            };
            (f.flatten = function(e, t) {
              return m(e, t, !1, []);
            }),
              (f.without = function(e) {
                return f.difference(e, a.call(arguments, 1));
              }),
              (f.uniq = f.unique = function(e, t, n, i) {
                if (null == e) return [];
                f.isBoolean(t) || ((i = n), (n = t), (t = !1)),
                  null != n && (n = f.iteratee(n, i));
                for (var r = [], o = [], a = 0, s = e.length; s > a; a++) {
                  var d = e[a];
                  if (t) (a && o === d) || r.push(d), (o = d);
                  else if (n) {
                    var u = n(d, a, e);
                    f.indexOf(o, u) < 0 && (o.push(u), r.push(d));
                  } else f.indexOf(r, d) < 0 && r.push(d);
                }
                return r;
              }),
              (f.union = function() {
                return f.uniq(m(arguments, !0, !0, []));
              }),
              (f.intersection = function(e) {
                if (null == e) return [];
                for (
                  var t = [], n = arguments.length, i = 0, r = e.length;
                  r > i;
                  i++
                ) {
                  var o = e[i];
                  if (!f.contains(t, o)) {
                    for (var a = 1; n > a && f.contains(arguments[a], o); a++);
                    a === n && t.push(o);
                  }
                }
                return t;
              }),
              (f.difference = function(e) {
                var t = m(a.call(arguments, 1), !0, !0, []);
                return f.filter(e, function(e) {
                  return !f.contains(t, e);
                });
              }),
              (f.zip = function(e) {
                if (null == e) return [];
                for (
                  var t = f.max(arguments, "length").length,
                    n = Array(t),
                    i = 0;
                  t > i;
                  i++
                )
                  n[i] = f.pluck(arguments, i);
                return n;
              }),
              (f.object = function(e, t) {
                if (null == e) return {};
                for (var n = {}, i = 0, r = e.length; r > i; i++)
                  t ? (n[e[i]] = t[i]) : (n[e[i][0]] = e[i][1]);
                return n;
              }),
              (f.indexOf = function(e, t, n) {
                if (null == e) return -1;
                var i = 0,
                  r = e.length;
                if (n) {
                  if ("number" != typeof n)
                    return (i = f.sortedIndex(e, t)), e[i] === t ? i : -1;
                  i = 0 > n ? Math.max(0, r + n) : n;
                }
                for (; r > i; i++) if (e[i] === t) return i;
                return -1;
              }),
              (f.lastIndexOf = function(e, t, n) {
                if (null == e) return -1;
                var i = e.length;
                for (
                  "number" == typeof n &&
                  (i = 0 > n ? i + n + 1 : Math.min(i, n + 1));
                  --i >= 0;

                )
                  if (e[i] === t) return i;
                return -1;
              }),
              (f.range = function(e, t, n) {
                arguments.length <= 1 && ((t = e || 0), (e = 0)), (n = n || 1);
                for (
                  var i = Math.max(Math.ceil((t - e) / n), 0),
                    r = Array(i),
                    o = 0;
                  i > o;
                  o++, e += n
                )
                  r[o] = e;
                return r;
              });
            var _ = function() {};
            (f.bind = function(e, t) {
              var n, i;
              if (p && e.bind === p) return p.apply(e, a.call(arguments, 1));
              if (!f.isFunction(e))
                throw new TypeError("Bind must be called on a function");
              return (
                (n = a.call(arguments, 2)),
                (i = function() {
                  if (!(this instanceof i))
                    return e.apply(t, n.concat(a.call(arguments)));
                  _.prototype = e.prototype;
                  var r = new _();
                  _.prototype = null;
                  var o = e.apply(r, n.concat(a.call(arguments)));
                  return f.isObject(o) ? o : r;
                })
              );
            }),
              (f.partial = function(e) {
                var t = a.call(arguments, 1);
                return function() {
                  for (
                    var n = 0, i = t.slice(), r = 0, o = i.length;
                    o > r;
                    r++
                  )
                    i[r] === f && (i[r] = arguments[n++]);
                  for (; n < arguments.length; ) i.push(arguments[n++]);
                  return e.apply(this, i);
                };
              }),
              (f.bindAll = function(e) {
                var t,
                  n,
                  i = arguments.length;
                if (1 >= i)
                  throw new Error("bindAll must be passed function names");
                for (t = 1; i > t; t++)
                  (n = arguments[t]), (e[n] = f.bind(e[n], e));
                return e;
              }),
              (f.memoize = function(e, t) {
                var n = function(i) {
                  var r = n.cache,
                    o = t ? t.apply(this, arguments) : i;
                  return f.has(r, o) || (r[o] = e.apply(this, arguments)), r[o];
                };
                return (n.cache = {}), n;
              }),
              (f.delay = function(e, t) {
                var n = a.call(arguments, 2);
                return setTimeout(function() {
                  return e.apply(null, n);
                }, t);
              }),
              (f.defer = function(e) {
                return f.delay.apply(f, [e, 1].concat(a.call(arguments, 1)));
              }),
              (f.throttle = function(e, t, n) {
                var i,
                  r,
                  o,
                  a = null,
                  s = 0;
                n || (n = {});
                var d = function() {
                  (s = n.leading === !1 ? 0 : f.now()),
                    (a = null),
                    (o = e.apply(i, r)),
                    a || (i = r = null);
                };
                return function() {
                  var u = f.now();
                  s || n.leading !== !1 || (s = u);
                  var l = t - (u - s);
                  return (
                    (i = this),
                    (r = arguments),
                    0 >= l || l > t
                      ? (clearTimeout(a),
                        (a = null),
                        (s = u),
                        (o = e.apply(i, r)),
                        a || (i = r = null))
                      : a || n.trailing === !1 || (a = setTimeout(d, l)),
                    o
                  );
                };
              }),
              (f.debounce = function(e, t, n) {
                var i,
                  r,
                  o,
                  a,
                  s,
                  d = function() {
                    var u = f.now() - a;
                    t > u && u > 0
                      ? (i = setTimeout(d, t - u))
                      : ((i = null),
                        n || ((s = e.apply(o, r)), i || (o = r = null)));
                  };
                return function() {
                  (o = this), (r = arguments), (a = f.now());
                  var u = n && !i;
                  return (
                    i || (i = setTimeout(d, t)),
                    u && ((s = e.apply(o, r)), (o = r = null)),
                    s
                  );
                };
              }),
              (f.wrap = function(e, t) {
                return f.partial(t, e);
              }),
              (f.negate = function(e) {
                return function() {
                  return !e.apply(this, arguments);
                };
              }),
              (f.compose = function() {
                var e = arguments,
                  t = e.length - 1;
                return function() {
                  for (var n = t, i = e[t].apply(this, arguments); n--; )
                    i = e[n].call(this, i);
                  return i;
                };
              }),
              (f.after = function(e, t) {
                return function() {
                  return --e < 1 ? t.apply(this, arguments) : void 0;
                };
              }),
              (f.before = function(e, t) {
                var n;
                return function() {
                  return (
                    --e > 0 ? (n = t.apply(this, arguments)) : (t = null), n
                  );
                };
              }),
              (f.once = f.partial(f.before, 2)),
              (f.keys = function(e) {
                if (!f.isObject(e)) return [];
                if (c) return c(e);
                var t = [];
                for (var n in e) f.has(e, n) && t.push(n);
                return t;
              }),
              (f.values = function(e) {
                for (
                  var t = f.keys(e), n = t.length, i = Array(n), r = 0;
                  n > r;
                  r++
                )
                  i[r] = e[t[r]];
                return i;
              }),
              (f.pairs = function(e) {
                for (
                  var t = f.keys(e), n = t.length, i = Array(n), r = 0;
                  n > r;
                  r++
                )
                  i[r] = [t[r], e[t[r]]];
                return i;
              }),
              (f.invert = function(e) {
                for (var t = {}, n = f.keys(e), i = 0, r = n.length; r > i; i++)
                  t[e[n[i]]] = n[i];
                return t;
              }),
              (f.functions = f.methods = function(e) {
                var t = [];
                for (var n in e) f.isFunction(e[n]) && t.push(n);
                return t.sort();
              }),
              (f.extend = function(e) {
                if (!f.isObject(e)) return e;
                for (var t, n, i = 1, r = arguments.length; r > i; i++) {
                  t = arguments[i];
                  for (n in t) u.call(t, n) && (e[n] = t[n]);
                }
                return e;
              }),
              (f.pick = function(e, t, n) {
                var i,
                  r = {};
                if (null == e) return r;
                if (f.isFunction(t)) {
                  t = h(t, n);
                  for (i in e) {
                    var o = e[i];
                    t(o, i, e) && (r[i] = o);
                  }
                } else {
                  var d = s.apply([], a.call(arguments, 1));
                  e = new Object(e);
                  for (var u = 0, l = d.length; l > u; u++)
                    (i = d[u]), i in e && (r[i] = e[i]);
                }
                return r;
              }),
              (f.omit = function(e, t, n) {
                if (f.isFunction(t)) t = f.negate(t);
                else {
                  var i = f.map(s.apply([], a.call(arguments, 1)), String);
                  t = function(e, t) {
                    return !f.contains(i, t);
                  };
                }
                return f.pick(e, t, n);
              }),
              (f.defaults = function(e) {
                if (!f.isObject(e)) return e;
                for (var t = 1, n = arguments.length; n > t; t++) {
                  var i = arguments[t];
                  for (var r in i) void 0 === e[r] && (e[r] = i[r]);
                }
                return e;
              }),
              (f.clone = function(e) {
                return f.isObject(e)
                  ? f.isArray(e)
                    ? e.slice()
                    : f.extend({}, e)
                  : e;
              }),
              (f.tap = function(e, t) {
                return t(e), e;
              });
            var y = function(e, t, n, i) {
              if (e === t) return 0 !== e || 1 / e === 1 / t;
              if (null == e || null == t) return e === t;
              e instanceof f && (e = e._wrapped),
                t instanceof f && (t = t._wrapped);
              var r = d.call(e);
              if (r !== d.call(t)) return !1;
              switch (r) {
                case "[object RegExp]":
                case "[object String]":
                  return "" + e == "" + t;
                case "[object Number]":
                  return +e !== +e
                    ? +t !== +t
                    : 0 === +e
                    ? 1 / +e === 1 / t
                    : +e === +t;
                case "[object Date]":
                case "[object Boolean]":
                  return +e === +t;
              }
              if ("object" != typeof e || "object" != typeof t) return !1;
              for (var o = n.length; o--; ) if (n[o] === e) return i[o] === t;
              var a = e.constructor,
                s = t.constructor;
              if (
                a !== s &&
                "constructor" in e &&
                "constructor" in t &&
                !(
                  f.isFunction(a) &&
                  a instanceof a &&
                  f.isFunction(s) &&
                  s instanceof s
                )
              )
                return !1;
              n.push(e), i.push(t);
              var u, l;
              if ("[object Array]" === r) {
                if (((u = e.length), (l = u === t.length)))
                  for (; u-- && (l = y(e[u], t[u], n, i)); );
              } else {
                var c,
                  p = f.keys(e);
                if (((u = p.length), (l = f.keys(t).length === u)))
                  for (
                    ;
                    u-- &&
                    ((c = p[u]), (l = f.has(t, c) && y(e[c], t[c], n, i)));

                  );
              }
              return n.pop(), i.pop(), l;
            };
            (f.isEqual = function(e, t) {
              return y(e, t, [], []);
            }),
              (f.isEmpty = function(e) {
                if (null == e) return !0;
                if (f.isArray(e) || f.isString(e) || f.isArguments(e))
                  return 0 === e.length;
                for (var t in e) if (f.has(e, t)) return !1;
                return !0;
              }),
              (f.isElement = function(e) {
                return !(!e || 1 !== e.nodeType);
              }),
              (f.isArray =
                l ||
                function(e) {
                  return "[object Array]" === d.call(e);
                }),
              (f.isObject = function(e) {
                var t = typeof e;
                return "function" === t || ("object" === t && !!e);
              }),
              f.each(
                ["Arguments", "Function", "String", "Number", "Date", "RegExp"],
                function(e) {
                  f["is" + e] = function(t) {
                    return d.call(t) === "[object " + e + "]";
                  };
                }
              ),
              f.isArguments(arguments) ||
                (f.isArguments = function(e) {
                  return f.has(e, "callee");
                }),
              "function" != typeof /./ &&
                (f.isFunction = function(e) {
                  return "function" == typeof e || !1;
                }),
              (f.isFinite = function(e) {
                return isFinite(e) && !isNaN(parseFloat(e));
              }),
              (f.isNaN = function(e) {
                return f.isNumber(e) && e !== +e;
              }),
              (f.isBoolean = function(e) {
                return e === !0 || e === !1 || "[object Boolean]" === d.call(e);
              }),
              (f.isNull = function(e) {
                return null === e;
              }),
              (f.isUndefined = function(e) {
                return void 0 === e;
              }),
              (f.has = function(e, t) {
                return null != e && u.call(e, t);
              }),
              (f.noConflict = function() {
                return (e._ = t), this;
              }),
              (f.identity = function(e) {
                return e;
              }),
              (f.constant = function(e) {
                return function() {
                  return e;
                };
              }),
              (f.noop = function() {}),
              (f.property = function(e) {
                return function(t) {
                  return t[e];
                };
              }),
              (f.matches = function(e) {
                var t = f.pairs(e),
                  n = t.length;
                return function(e) {
                  if (null == e) return !n;
                  e = new Object(e);
                  for (var i = 0; n > i; i++) {
                    var r = t[i],
                      o = r[0];
                    if (r[1] !== e[o] || !(o in e)) return !1;
                  }
                  return !0;
                };
              }),
              (f.times = function(e, t, n) {
                var i = Array(Math.max(0, e));
                t = h(t, n, 1);
                for (var r = 0; e > r; r++) i[r] = t(r);
                return i;
              }),
              (f.random = function(e, t) {
                return (
                  null == t && ((t = e), (e = 0)),
                  e + Math.floor(Math.random() * (t - e + 1))
                );
              }),
              (f.now =
                Date.now ||
                function() {
                  return new Date().getTime();
                });
            var b = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
              },
              w = f.invert(b),
              E = function(e) {
                var t = function(t) {
                    return e[t];
                  },
                  n = "(?:" + f.keys(e).join("|") + ")",
                  i = RegExp(n),
                  r = RegExp(n, "g");
                return function(e) {
                  return (
                    (e = null == e ? "" : "" + e),
                    i.test(e) ? e.replace(r, t) : e
                  );
                };
              };
            (f.escape = E(b)),
              (f.unescape = E(w)),
              (f.result = function(e, t) {
                if (null == e) return void 0;
                var n = e[t];
                return f.isFunction(n) ? e[t]() : n;
              });
            var S = 0;
            (f.uniqueId = function(e) {
              var t = ++S + "";
              return e ? e + t : t;
            }),
              (f.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
              });
            var C = /(.)^/,
              T = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
              },
              A = /\\|'|\r|\n|\u2028|\u2029/g,
              x = function(e) {
                return "\\" + T[e];
              };
            (f.template = function(e, t, n) {
              !t && n && (t = n), (t = f.defaults({}, t, f.templateSettings));
              var i = RegExp(
                  [
                    (t.escape || C).source,
                    (t.interpolate || C).source,
                    (t.evaluate || C).source
                  ].join("|") + "|$",
                  "g"
                ),
                r = 0,
                o = "__p+='";
              e.replace(i, function(t, n, i, a, s) {
                return (
                  (o += e.slice(r, s).replace(A, x)),
                  (r = s + t.length),
                  n
                    ? (o +=
                        "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'")
                    : i
                    ? (o += "'+\n((__t=(" + i + "))==null?'':__t)+\n'")
                    : a && (o += "';\n" + a + "\n__p+='"),
                  t
                );
              }),
                (o += "';\n"),
                t.variable || (o = "with(obj||{}){\n" + o + "}\n"),
                (o =
                  "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" +
                  o +
                  "return __p;\n");
              try {
                var a = new Function(t.variable || "obj", "_", o);
              } catch (s) {
                throw ((s.source = o), s);
              }
              var d = function(e) {
                  return a.call(this, e, f);
                },
                u = t.variable || "obj";
              return (d.source = "function(" + u + "){\n" + o + "}"), d;
            }),
              (f.chain = function(e) {
                var t = f(e);
                return (t._chain = !0), t;
              });
            var I = function(e) {
              return this._chain ? f(e).chain() : e;
            };
            (f.mixin = function(e) {
              f.each(f.functions(e), function(t) {
                var n = (f[t] = e[t]);
                f.prototype[t] = function() {
                  var e = [this._wrapped];
                  return o.apply(e, arguments), I.call(this, n.apply(f, e));
                };
              });
            }),
              f.mixin(f),
              f.each(
                [
                  "pop",
                  "push",
                  "reverse",
                  "shift",
                  "sort",
                  "splice",
                  "unshift"
                ],
                function(e) {
                  var t = n[e];
                  f.prototype[e] = function() {
                    var n = this._wrapped;
                    return (
                      t.apply(n, arguments),
                      ("shift" !== e && "splice" !== e) ||
                        0 !== n.length ||
                        delete n[0],
                      I.call(this, n)
                    );
                  };
                }
              ),
              f.each(["concat", "join", "slice"], function(e) {
                var t = n[e];
                f.prototype[e] = function() {
                  return I.call(this, t.apply(this._wrapped, arguments));
                };
              }),
              (f.prototype.value = function() {
                return this._wrapped;
              });
          }.call({}));
          var SIZZLE_EXT = {};
          !(function() {
            function e(e, t, n, i) {
              var r, o, a, s, d, l, p, f, h, g;
              if (
                ((t ? t.ownerDocument || t : F) !== G && L(t),
                (t = t || G),
                (n = n || []),
                !e || "string" != typeof e)
              )
                return n;
              if (1 !== (s = t.nodeType) && 9 !== s) return [];
              if (N && !i) {
                if ((r = me.exec(e)))
                  if ((a = r[1])) {
                    if (9 === s) {
                      if (((o = t.getElementById(a)), !o || !o.parentNode))
                        return n;
                      if (o.id === a) return n.push(o), n;
                    } else if (
                      t.ownerDocument &&
                      (o = t.ownerDocument.getElementById(a)) &&
                      R(t, o) &&
                      o.id === a
                    )
                      return n.push(o), n;
                  } else {
                    if (r[2]) return Y.apply(n, t.getElementsByTagName(e)), n;
                    if (
                      (a = r[3]) &&
                      b.getElementsByClassName &&
                      t.getElementsByClassName
                    )
                      return Y.apply(n, t.getElementsByClassName(a)), n;
                  }
                if (b.qsa && (!k || !k.test(e))) {
                  if (
                    ((f = p = M),
                    (h = t),
                    (g = 9 === s && e),
                    1 === s && "object" !== t.nodeName.toLowerCase())
                  ) {
                    for (
                      l = C(e),
                        (p = t.getAttribute("id"))
                          ? (f = p.replace(ye, "\\$&"))
                          : t.setAttribute("id", f),
                        f = "[id='" + f + "'] ",
                        d = l.length;
                      d--;

                    )
                      l[d] = f + c(l[d]);
                    (h = (_e.test(e) && u(t.parentNode)) || t),
                      (g = l.join(","));
                  }
                  if (g)
                    try {
                      return Y.apply(n, h.querySelectorAll(g)), n;
                    } catch (v) {
                    } finally {
                      p || t.removeAttribute("id");
                    }
                }
              }
              return A(e.replace(se, "$1"), t, n, i);
            }
            function t() {
              function e(n, i) {
                return (
                  t.push(n + " ") > w.cacheLength && delete e[t.shift()],
                  (e[n + " "] = i)
                );
              }
              var t = [];
              return e;
            }
            function n(e) {
              return (e[M] = !0), e;
            }
            function i(e) {
              var t = G.createElement("div");
              try {
                return !!e(t);
              } catch (n) {
                return !1;
              } finally {
                t.parentNode && t.parentNode.removeChild(t), (t = null);
              }
            }
            function r(e, t) {
              for (var n = e.split("|"), i = e.length; i--; )
                w.attrHandle[n[i]] = t;
            }
            function o(e, t) {
              var n = t && e,
                i =
                  n &&
                  1 === e.nodeType &&
                  1 === t.nodeType &&
                  (~t.sourceIndex || J) - (~e.sourceIndex || J);
              if (i) return i;
              if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
              return e ? 1 : -1;
            }
            function a(e) {
              return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e;
              };
            }
            function s(e) {
              return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e;
              };
            }
            function d(e) {
              return n(function(t) {
                return (
                  (t = +t),
                  n(function(n, i) {
                    for (var r, o = e([], n.length, t), a = o.length; a--; )
                      n[(r = o[a])] && (n[r] = !(i[r] = n[r]));
                  })
                );
              });
            }
            function u(e) {
              return e && typeof e.getElementsByTagName !== q && e;
            }
            function l() {}
            function c(e) {
              for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
              return i;
            }
            function p(e, t, n) {
              var i = t.dir,
                r = n && "parentNode" === i,
                o = H++;
              return t.first
                ? function(t, n, o) {
                    for (; (t = t[i]); )
                      if (1 === t.nodeType || r) return e(t, n, o);
                  }
                : function(t, n, a) {
                    var s,
                      d,
                      u = [U, o];
                    if (a) {
                      for (; (t = t[i]); )
                        if ((1 === t.nodeType || r) && e(t, n, a)) return !0;
                    } else
                      for (; (t = t[i]); )
                        if (1 === t.nodeType || r) {
                          if (
                            ((d = t[M] || (t[M] = {})),
                            (s = d[i]) && s[0] === U && s[1] === o)
                          )
                            return (u[2] = s[2]);
                          if (((d[i] = u), (u[2] = e(t, n, a)))) return !0;
                        }
                  };
            }
            function f(e) {
              return e.length > 1
                ? function(t, n, i) {
                    for (var r = e.length; r--; ) if (!e[r](t, n, i)) return !1;
                    return !0;
                  }
                : e[0];
            }
            function h(t, n, i) {
              for (var r = 0, o = n.length; o > r; r++) e(t, n[r], i);
              return i;
            }
            function g(e, t, n, i, r) {
              for (
                var o, a = [], s = 0, d = e.length, u = null != t;
                d > s;
                s++
              )
                (o = e[s]) && (!n || n(o, i, r)) && (a.push(o), u && t.push(s));
              return a;
            }
            function v(e, t, i, r, o, a) {
              return (
                r && !r[M] && (r = v(r)),
                o && !o[M] && (o = v(o, a)),
                n(function(n, a, s, d) {
                  var u,
                    l,
                    c,
                    p = [],
                    f = [],
                    v = a.length,
                    m = n || h(t || "*", s.nodeType ? [s] : s, []),
                    _ = !e || (!n && t) ? m : g(m, p, e, s, d),
                    y = i ? (o || (n ? e : v || r) ? [] : a) : _;
                  if ((i && i(_, y, s, d), r))
                    for (u = g(y, f), r(u, [], s, d), l = u.length; l--; )
                      (c = u[l]) && (y[f[l]] = !(_[f[l]] = c));
                  if (n) {
                    if (o || e) {
                      if (o) {
                        for (u = [], l = y.length; l--; )
                          (c = y[l]) && u.push((_[l] = c));
                        o(null, (y = []), u, d);
                      }
                      for (l = y.length; l--; )
                        (c = y[l]) &&
                          (u = o ? ee.call(n, c) : p[l]) > -1 &&
                          (n[u] = !(a[u] = c));
                    }
                  } else (y = g(y === a ? y.splice(v, y.length) : y)), o ? o(null, a, y, d) : Y.apply(a, y);
                })
              );
            }
            function m(e) {
              for (
                var t,
                  n,
                  i,
                  r = e.length,
                  o = w.relative[e[0].type],
                  a = o || w.relative[" "],
                  s = o ? 1 : 0,
                  d = p(
                    function(e) {
                      return e === t;
                    },
                    a,
                    !0
                  ),
                  u = p(
                    function(e) {
                      return ee.call(t, e) > -1;
                    },
                    a,
                    !0
                  ),
                  l = [
                    function(e, n, i) {
                      return (
                        (!o && (i || n !== x)) ||
                        ((t = n).nodeType ? d(e, n, i) : u(e, n, i))
                      );
                    }
                  ];
                r > s;
                s++
              )
                if ((n = w.relative[e[s].type])) l = [p(f(l), n)];
                else {
                  if (
                    ((n = w.filter[e[s].type].apply(null, e[s].matches)), n[M])
                  ) {
                    for (i = ++s; r > i && !w.relative[e[i].type]; i++);
                    return v(
                      s > 1 && f(l),
                      s > 1 &&
                        c(
                          e
                            .slice(0, s - 1)
                            .concat({ value: " " === e[s - 2].type ? "*" : "" })
                        ).replace(se, "$1"),
                      n,
                      i > s && m(e.slice(s, i)),
                      r > i && m((e = e.slice(i))),
                      r > i && c(e)
                    );
                  }
                  l.push(n);
                }
              return f(l);
            }
            function _(t, i) {
              var r = i.length > 0,
                o = t.length > 0,
                a = function(n, a, s, d, u) {
                  var l,
                    c,
                    p,
                    f = 0,
                    h = "0",
                    v = n && [],
                    m = [],
                    _ = x,
                    y = n || (o && w.find.TAG("*", u)),
                    b = (U += null == _ ? 1 : Math.random() || 0.1),
                    E = y.length;
                  for (
                    u && (x = a !== G && a);
                    h !== E && null != (l = y[h]);
                    h++
                  ) {
                    if (o && l) {
                      for (c = 0; (p = t[c++]); )
                        if (p(l, a, s)) {
                          d.push(l);
                          break;
                        }
                      u && (U = b);
                    }
                    r && ((l = !p && l) && f--, n && v.push(l));
                  }
                  if (((f += h), r && h !== f)) {
                    for (c = 0; (p = i[c++]); ) p(v, m, a, s);
                    if (n) {
                      if (f > 0)
                        for (; h--; ) v[h] || m[h] || (m[h] = Z.call(d));
                      m = g(m);
                    }
                    Y.apply(d, m),
                      u &&
                        !n &&
                        m.length > 0 &&
                        f + i.length > 1 &&
                        e.uniqueSort(d);
                  }
                  return u && ((U = b), (x = _)), v;
                };
              return r ? n(a) : a;
            }
            var y,
              b,
              w,
              E,
              S,
              C,
              T,
              A,
              x,
              I,
              O,
              L,
              G,
              B,
              N,
              k,
              D,
              P,
              R,
              M = "sizzle" + -new Date(),
              F = window.document,
              U = 0,
              H = 0,
              z = t(),
              W = t(),
              j = t(),
              V = function(e, t) {
                return e === t && (O = !0), 0;
              },
              q = typeof undefined,
              J = 1 << 31,
              X = {}.hasOwnProperty,
              K = [],
              Z = K.pop,
              $ = K.push,
              Y = K.push,
              Q = K.slice,
              ee =
                K.indexOf ||
                function(e) {
                  for (var t = 0, n = this.length; n > t; t++)
                    if (this[t] === e) return t;
                  return -1;
                },
              te =
                "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
              ne = "[\\x20\\t\\r\\n\\f]",
              ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
              re = ie.replace("w", "w#"),
              oe =
                "\\[" +
                ne +
                "*(" +
                ie +
                ")" +
                ne +
                "*(?:([*^$|!~]?=)" +
                ne +
                "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" +
                re +
                ")|)|)" +
                ne +
                "*\\]",
              ae =
                ":(" +
                ie +
                ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
                oe.replace(3, 8) +
                ")*)|.*)\\)|)",
              se = new RegExp(
                "^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$",
                "g"
              ),
              de = new RegExp("^" + ne + "*," + ne + "*"),
              ue = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
              le = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
              ce = new RegExp(ae),
              pe = new RegExp("^" + re + "$"),
              fe = {
                ID: new RegExp("^#(" + ie + ")"),
                CLASS: new RegExp("^\\.(" + ie + ")"),
                TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + oe),
                PSEUDO: new RegExp("^" + ae),
                CHILD: new RegExp(
                  "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                    ne +
                    "*(even|odd|(([+-]|)(\\d*)n|)" +
                    ne +
                    "*(?:([+-]|)" +
                    ne +
                    "*(\\d+)|))" +
                    ne +
                    "*\\)|)",
                  "i"
                ),
                bool: new RegExp("^(?:" + te + ")$", "i"),
                needsContext: new RegExp(
                  "^" +
                    ne +
                    "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    ne +
                    "*((?:-\\d)?\\d*)" +
                    ne +
                    "*\\)|)(?=[^-]|$)",
                  "i"
                )
              },
              he = /^(?:input|select|textarea|button)$/i,
              ge = /^h\d$/i,
              ve = /^[^{]+\{\s*\[native \w/,
              me = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
              _e = /[+~]/,
              ye = /'|\\/g,
              be = new RegExp(
                "\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)",
                "ig"
              ),
              we = function(e, t, n) {
                var i = "0x" + t - 65536;
                return i !== i || n
                  ? t
                  : 0 > i
                  ? String.fromCharCode(i + 65536)
                  : String.fromCharCode((i >> 10) | 55296, (1023 & i) | 56320);
              };
            try {
              Y.apply((K = Q.call(F.childNodes)), F.childNodes),
                K[F.childNodes.length].nodeType;
            } catch (Ee) {
              Y = {
                apply: K.length
                  ? function(e, t) {
                      $.apply(e, Q.call(t));
                    }
                  : function(e, t) {
                      for (var n = e.length, i = 0; (e[n++] = t[i++]); );
                      e.length = n - 1;
                    }
              };
            }
            (b = e.support = {}),
              (S = e.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? "HTML" !== t.nodeName : !1;
              }),
              (L = e.setDocument = function(e) {
                var t,
                  n = e ? e.ownerDocument || e : F,
                  r = n.defaultView;
                return n !== G && 9 === n.nodeType && n.documentElement
                  ? ((G = n),
                    (B = n.documentElement),
                    (N = !S(n)),
                    r &&
                      r !== r.top &&
                      (r.addEventListener
                        ? r.addEventListener(
                            "unload",
                            function() {
                              L();
                            },
                            !1
                          )
                        : r.browser.attachEvent &&
                          r.attachEvent("onunload", function() {
                            L();
                          })),
                    (b.attributes = i(function(e) {
                      return (e.className = "i"), !e.getAttribute("className");
                    })),
                    (b.getElementsByTagName = i(function(e) {
                      return (
                        e.appendChild(n.createComment("")),
                        !e.getElementsByTagName("*").length
                      );
                    })),
                    (b.getElementsByClassName =
                      ve.test(n.getElementsByClassName) &&
                      i(function(e) {
                        return (
                          (e.innerHTML =
                            "<div class='a'></div><div class='a i'></div>"),
                          (e.firstChild.className = "i"),
                          2 === e.getElementsByClassName("i").length
                        );
                      })),
                    (b.getById = i(function(e) {
                      return (
                        (B.appendChild(e).id = M),
                        !n.getElementsByName || !n.getElementsByName(M).length
                      );
                    })),
                    b.getById
                      ? ((w.find.ID = function(e, t) {
                          if (typeof t.getElementById !== q && N) {
                            var n = t.getElementById(e);
                            return n && n.parentNode ? [n] : [];
                          }
                        }),
                        (w.filter.ID = function(e) {
                          var t = e.replace(be, we);
                          return function(e) {
                            return e.getAttribute("id") === t;
                          };
                        }))
                      : (delete w.find.ID,
                        (w.filter.ID = function(e) {
                          var t = e.replace(be, we);
                          return function(e) {
                            var n =
                              typeof e.getAttributeNode !== q &&
                              e.getAttributeNode("id");
                            return n && n.value === t;
                          };
                        })),
                    (w.find.TAG = b.getElementsByTagName
                      ? function(e, t) {
                          return typeof t.getElementsByTagName !== q
                            ? t.getElementsByTagName(e)
                            : void 0;
                        }
                      : function(e, t) {
                          var n,
                            i = [],
                            r = 0,
                            o = t.getElementsByTagName(e);
                          if ("*" === e) {
                            for (; (n = o[r++]); )
                              1 === n.nodeType && i.push(n);
                            return i;
                          }
                          return o;
                        }),
                    (w.find.CLASS =
                      b.getElementsByClassName &&
                      function(e, t) {
                        return typeof t.getElementsByClassName !== q && N
                          ? t.getElementsByClassName(e)
                          : void 0;
                      }),
                    (D = []),
                    (k = []),
                    (b.qsa = ve.test(n.querySelectorAll)) &&
                      (i(function(e) {
                        (e.innerHTML =
                          "<select t=''><option selected=''></option></select>"),
                          e.querySelectorAll("[t^='']").length &&
                            k.push("[*^$]=" + ne + "*(?:''|\"\")"),
                          e.querySelectorAll("[selected]").length ||
                            k.push("\\[" + ne + "*(?:value|" + te + ")"),
                          e.querySelectorAll(":checked").length ||
                            k.push(":checked");
                      }),
                      i(function(e) {
                        var t = n.createElement("input");
                        t.setAttribute("type", "hidden"),
                          e.appendChild(t).setAttribute("name", "D"),
                          e.querySelectorAll("[name=d]").length &&
                            k.push("name" + ne + "*[*^$|!~]?="),
                          e.querySelectorAll(":enabled").length ||
                            k.push(":enabled", ":disabled"),
                          e.querySelectorAll("*,:x"),
                          k.push(",.*:");
                      })),
                    (b.matchesSelector = ve.test(
                      (P =
                        B.matches ||
                        B.webkitMatchesSelector ||
                        B.mozMatchesSelector ||
                        B.oMatchesSelector ||
                        B.msMatchesSelector)
                    )) &&
                      i(function(e) {
                        (b.disconnectedMatch = P.call(e, "div")),
                          P.call(e, "[s!='']:x"),
                          D.push("!=", ae);
                      }),
                    (k = k.length && new RegExp(k.join("|"))),
                    (D = D.length && new RegExp(D.join("|"))),
                    (t = ve.test(B.compareDocumentPosition)),
                    (R =
                      t || ve.test(B.contains)
                        ? function(e, t) {
                            var n = 9 === e.nodeType ? e.documentElement : e,
                              i = t && t.parentNode;
                            return (
                              e === i ||
                              !(
                                !i ||
                                1 !== i.nodeType ||
                                !(n.contains
                                  ? n.contains(i)
                                  : e.compareDocumentPosition &&
                                    16 & e.compareDocumentPosition(i))
                              )
                            );
                          }
                        : function(e, t) {
                            if (t)
                              for (; (t = t.parentNode); )
                                if (t === e) return !0;
                            return !1;
                          }),
                    (V = t
                      ? function(e, t) {
                          if (e === t) return (O = !0), 0;
                          var i =
                            !e.compareDocumentPosition -
                            !t.compareDocumentPosition;
                          return i
                            ? i
                            : ((i =
                                (e.ownerDocument || e) ===
                                (t.ownerDocument || t)
                                  ? e.compareDocumentPosition(t)
                                  : 1),
                              1 & i ||
                              (!b.sortDetached &&
                                t.compareDocumentPosition(e) === i)
                                ? e === n || (e.ownerDocument === F && R(F, e))
                                  ? -1
                                  : t === n ||
                                    (t.ownerDocument === F && R(F, t))
                                  ? 1
                                  : I
                                  ? ee.call(I, e) - ee.call(I, t)
                                  : 0
                                : 4 & i
                                ? -1
                                : 1);
                        }
                      : function(e, t) {
                          if (e === t) return (O = !0), 0;
                          var i,
                            r = 0,
                            a = e.parentNode,
                            s = t.parentNode,
                            d = [e],
                            u = [t];
                          if (!a || !s)
                            return e === n
                              ? -1
                              : t === n
                              ? 1
                              : a
                              ? -1
                              : s
                              ? 1
                              : I
                              ? ee.call(I, e) - ee.call(I, t)
                              : 0;
                          if (a === s) return o(e, t);
                          for (i = e; (i = i.parentNode); ) d.unshift(i);
                          for (i = t; (i = i.parentNode); ) u.unshift(i);
                          for (; d[r] === u[r]; ) r++;
                          return r
                            ? o(d[r], u[r])
                            : d[r] === F
                            ? -1
                            : u[r] === F
                            ? 1
                            : 0;
                        }),
                    n)
                  : G;
              }),
              (e.matches = function(t, n) {
                return e(t, null, null, n);
              }),
              (e.matchesSelector = function(t, n) {
                if (
                  ((t.ownerDocument || t) !== G && L(t),
                  (n = n.replace(le, "='$1']")),
                  b.matchesSelector &&
                    N &&
                    (!D || !D.test(n)) &&
                    (!k || !k.test(n)))
                )
                  try {
                    var i = P.call(t, n);
                    if (
                      i ||
                      b.disconnectedMatch ||
                      (t.document && 11 !== t.document.nodeType)
                    )
                      return i;
                  } catch (r) {}
                return e(n, G, null, [t]).length > 0;
              }),
              (e.contains = function(e, t) {
                return (e.ownerDocument || e) !== G && L(e), R(e, t);
              }),
              (e.attr = function(e, t) {
                (e.ownerDocument || e) !== G && L(e);
                var n = w.attrHandle[t.toLowerCase()],
                  i =
                    n && X.call(w.attrHandle, t.toLowerCase())
                      ? n(e, t, !N)
                      : undefined;
                return i !== undefined
                  ? i
                  : b.attributes || !N
                  ? e.getAttribute(t)
                  : (i = e.getAttributeNode(t)) && i.specified
                  ? i.value
                  : null;
              }),
              (e.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e);
              }),
              (e.uniqueSort = function(e) {
                var t,
                  n = [],
                  i = 0,
                  r = 0;
                if (
                  ((O = !b.detectDuplicates),
                  (I = !b.sortStable && e.slice(0)),
                  e.sort(V),
                  O)
                ) {
                  for (; (t = e[r++]); ) t === e[r] && (i = n.push(r));
                  for (; i--; ) e.splice(n[i], 1);
                }
                return (I = null), e;
              }),
              (E = e.getText = function(e) {
                var t,
                  n = "",
                  i = 0,
                  r = e.nodeType;
                if (r) {
                  if (1 === r || 9 === r || 11 === r) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += E(e);
                  } else if (3 === r || 4 === r) return e.nodeValue;
                } else for (; (t = e[i++]); ) n += E(t);
                return n;
              }),
              (w = e.selectors = {
                cacheLength: 50,
                createPseudo: n,
                match: fe,
                attrHandle: {},
                find: {},
                relative: {
                  ">": { dir: "parentNode", first: !0 },
                  " ": { dir: "parentNode" },
                  "+": { dir: "previousSibling", first: !0 },
                  "~": { dir: "previousSibling" }
                },
                preFilter: {
                  ATTR: function(e) {
                    return (
                      (e[1] = e[1].replace(be, we)),
                      (e[3] = (e[4] || e[5] || "").replace(be, we)),
                      "~=" === e[2] && (e[3] = " " + e[3] + " "),
                      e.slice(0, 4)
                    );
                  },
                  CHILD: function(t) {
                    return (
                      (t[1] = t[1].toLowerCase()),
                      "nth" === t[1].slice(0, 3)
                        ? (t[3] || e.error(t[0]),
                          (t[4] = +(t[4]
                            ? t[5] + (t[6] || 1)
                            : 2 * ("even" === t[3] || "odd" === t[3]))),
                          (t[5] = +(t[7] + t[8] || "odd" === t[3])))
                        : t[3] && e.error(t[0]),
                      t
                    );
                  },
                  PSEUDO: function(e) {
                    var t,
                      n = !e[5] && e[2];
                    return fe.CHILD.test(e[0])
                      ? null
                      : (e[3] && e[4] !== undefined
                          ? (e[2] = e[4])
                          : n &&
                            ce.test(n) &&
                            (t = C(n, !0)) &&
                            (t = n.indexOf(")", n.length - t) - n.length) &&
                            ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                        e.slice(0, 3));
                  }
                },
                filter: {
                  TAG: function(e) {
                    var t = e.replace(be, we).toLowerCase();
                    return "*" === e
                      ? function() {
                          return !0;
                        }
                      : function(e) {
                          return e.nodeName && e.nodeName.toLowerCase() === t;
                        };
                  },
                  CLASS: function(e) {
                    var t = z[e + " "];
                    return (
                      t ||
                      ((t = new RegExp(
                        "(^|" + ne + ")" + e + "(" + ne + "|$)"
                      )) &&
                        z(e, function(e) {
                          return t.test(
                            ("string" == typeof e.className && e.className) ||
                              (typeof e.getAttribute !== q &&
                                e.getAttribute("class")) ||
                              ""
                          );
                        }))
                    );
                  },
                  ATTR: function(t, n, i) {
                    return function(r) {
                      var o = e.attr(r, t);
                      return null == o
                        ? "!=" === n
                        : n
                        ? ((o += ""),
                          "=" === n
                            ? o === i
                            : "!=" === n
                            ? o !== i
                            : "^=" === n
                            ? i && 0 === o.indexOf(i)
                            : "*=" === n
                            ? i && o.indexOf(i) > -1
                            : "$=" === n
                            ? i && o.slice(-i.length) === i
                            : "~=" === n
                            ? (" " + o + " ").indexOf(i) > -1
                            : "|=" === n
                            ? o === i || o.slice(0, i.length + 1) === i + "-"
                            : !1)
                        : !0;
                    };
                  },
                  CHILD: function(e, t, n, i, r) {
                    var o = "nth" !== e.slice(0, 3),
                      a = "last" !== e.slice(-4),
                      s = "of-type" === t;
                    return 1 === i && 0 === r
                      ? function(e) {
                          return !!e.parentNode;
                        }
                      : function(t, n, d) {
                          var u,
                            l,
                            c,
                            p,
                            f,
                            h,
                            g = o !== a ? "nextSibling" : "previousSibling",
                            v = t.parentNode,
                            m = s && t.nodeName.toLowerCase(),
                            _ = !d && !s;
                          if (v) {
                            if (o) {
                              for (; g; ) {
                                for (c = t; (c = c[g]); )
                                  if (
                                    s
                                      ? c.nodeName.toLowerCase() === m
                                      : 1 === c.nodeType
                                  )
                                    return !1;
                                h = g = "only" === e && !h && "nextSibling";
                              }
                              return !0;
                            }
                            if (
                              ((h = [a ? v.firstChild : v.lastChild]), a && _)
                            ) {
                              for (
                                l = v[M] || (v[M] = {}),
                                  u = l[e] || [],
                                  f = u[0] === U && u[1],
                                  p = u[0] === U && u[2],
                                  c = f && v.childNodes[f];
                                (c =
                                  (++f && c && c[g]) || (p = f = 0) || h.pop());

                              )
                                if (1 === c.nodeType && ++p && c === t) {
                                  l[e] = [U, f, p];
                                  break;
                                }
                            } else if (
                              _ &&
                              (u = (t[M] || (t[M] = {}))[e]) &&
                              u[0] === U
                            )
                              p = u[1];
                            else
                              for (
                                ;
                                (c =
                                  (++f && c && c[g]) ||
                                  (p = f = 0) ||
                                  h.pop()) &&
                                ((s
                                  ? c.nodeName.toLowerCase() !== m
                                  : 1 !== c.nodeType) ||
                                  !++p ||
                                  (_ && ((c[M] || (c[M] = {}))[e] = [U, p]),
                                  c !== t));

                              );
                            return (
                              (p -= r), p === i || (p % i === 0 && p / i >= 0)
                            );
                          }
                        };
                  },
                  PSEUDO: function(t, i) {
                    var r,
                      o =
                        w.pseudos[t] ||
                        w.setFilters[t.toLowerCase()] ||
                        e.error("unsupported pseudo: " + t);
                    return o[M]
                      ? o(i)
                      : o.length > 1
                      ? ((r = [t, t, "", i]),
                        w.setFilters.hasOwnProperty(t.toLowerCase())
                          ? n(function(e, t) {
                              for (var n, r = o(e, i), a = r.length; a--; )
                                (n = ee.call(e, r[a])), (e[n] = !(t[n] = r[a]));
                            })
                          : function(e) {
                              return o(e, 0, r);
                            })
                      : o;
                  }
                },
                pseudos: {
                  not: n(function(e) {
                    var t = [],
                      i = [],
                      r = T(e.replace(se, "$1"));
                    return r[M]
                      ? n(function(e, t, n, i) {
                          for (
                            var o, a = r(e, null, i, []), s = e.length;
                            s--;

                          )
                            (o = a[s]) && (e[s] = !(t[s] = o));
                        })
                      : function(e, n, o) {
                          return (t[0] = e), r(t, null, o, i), !i.pop();
                        };
                  }),
                  has: n(function(t) {
                    return function(n) {
                      return e(t, n).length > 0;
                    };
                  }),
                  contains: n(function(e) {
                    return function(t) {
                      return (
                        (t.textContent || t.innerText || E(t)).indexOf(e) > -1
                      );
                    };
                  }),
                  lang: n(function(t) {
                    return (
                      pe.test(t || "") || e.error("unsupported lang: " + t),
                      (t = t.replace(be, we).toLowerCase()),
                      function(e) {
                        var n;
                        do
                          if (
                            (n = N
                              ? e.lang
                              : e.getAttribute("xml:lang") ||
                                e.getAttribute("lang"))
                          )
                            return (
                              (n = n.toLowerCase()),
                              n === t || 0 === n.indexOf(t + "-")
                            );
                        while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1;
                      }
                    );
                  }),
                  target: function(e) {
                    var t = window.location && window.location.hash;
                    return t && t.slice(1) === e.id;
                  },
                  root: function(e) {
                    return e === B;
                  },
                  focus: function(e) {
                    return (
                      e === G.activeElement &&
                      (!G.hasFocus || G.hasFocus()) &&
                      !!(e.type || e.href || ~e.tabIndex)
                    );
                  },
                  enabled: function(e) {
                    return e.disabled === !1;
                  },
                  disabled: function(e) {
                    return e.disabled === !0;
                  },
                  checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return (
                      ("input" === t && !!e.checked) ||
                      ("option" === t && !!e.selected)
                    );
                  },
                  selected: function(e) {
                    return (
                      e.parentNode && e.parentNode.selectedIndex,
                      e.selected === !0
                    );
                  },
                  empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                      if (e.nodeType < 6) return !1;
                    return !0;
                  },
                  parent: function(e) {
                    return !w.pseudos.empty(e);
                  },
                  header: function(e) {
                    return ge.test(e.nodeName);
                  },
                  input: function(e) {
                    return he.test(e.nodeName);
                  },
                  button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return (
                      ("input" === t && "button" === e.type) || "button" === t
                    );
                  },
                  text: function(e) {
                    var t;
                    return (
                      "input" === e.nodeName.toLowerCase() &&
                      "text" === e.type &&
                      (null == (t = e.getAttribute("type")) ||
                        "text" === t.toLowerCase())
                    );
                  },
                  first: d(function() {
                    return [0];
                  }),
                  last: d(function(e, t) {
                    return [t - 1];
                  }),
                  eq: d(function(e, t, n) {
                    return [0 > n ? n + t : n];
                  }),
                  even: d(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e;
                  }),
                  odd: d(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e;
                  }),
                  lt: d(function(e, t, n) {
                    for (var i = 0 > n ? n + t : n; --i >= 0; ) e.push(i);
                    return e;
                  }),
                  gt: d(function(e, t, n) {
                    for (var i = 0 > n ? n + t : n; ++i < t; ) e.push(i);
                    return e;
                  })
                }
              }),
              (w.pseudos.nth = w.pseudos.eq);
            for (y in {
              radio: !0,
              checkbox: !0,
              file: !0,
              password: !0,
              image: !0
            })
              w.pseudos[y] = a(y);
            for (y in { submit: !0, reset: !0 }) w.pseudos[y] = s(y);
            (l.prototype = w.filters = w.pseudos),
              (w.setFilters = new l()),
              (C = e.tokenize = function(t, n) {
                var i,
                  r,
                  o,
                  a,
                  s,
                  d,
                  u,
                  l = W[t + " "];
                if (l) return n ? 0 : l.slice(0);
                for (s = t, d = [], u = w.preFilter; s; ) {
                  (!i || (r = de.exec(s))) &&
                    (r && (s = s.slice(r[0].length) || s), d.push((o = []))),
                    (i = !1),
                    (r = ue.exec(s)) &&
                      ((i = r.shift()),
                      o.push({ value: i, type: r[0].replace(se, " ") }),
                      (s = s.slice(i.length)));
                  for (a in w.filter)
                    !(r = fe[a].exec(s)) ||
                      (u[a] && !(r = u[a](r))) ||
                      ((i = r.shift()),
                      o.push({ value: i, type: a, matches: r }),
                      (s = s.slice(i.length)));
                  if (!i) break;
                }
                return n ? s.length : s ? e.error(t) : W(t, d).slice(0);
              }),
              (T = e.compile = function(e, t) {
                var n,
                  i = [],
                  r = [],
                  o = j[e + " "];
                if (!o) {
                  for (t || (t = C(e)), n = t.length; n--; )
                    (o = m(t[n])), o[M] ? i.push(o) : r.push(o);
                  (o = j(e, _(r, i))), (o.selector = e);
                }
                return o;
              }),
              (A = e.select = function(e, t, n, i) {
                var r,
                  o,
                  a,
                  s,
                  d,
                  l = "function" == typeof e && e,
                  p = !i && C((e = l.selector || e));
                if (((n = n || []), 1 === p.length)) {
                  if (
                    ((o = p[0] = p[0].slice(0)),
                    o.length > 2 &&
                      "ID" === (a = o[0]).type &&
                      b.getById &&
                      9 === t.nodeType &&
                      N &&
                      w.relative[o[1].type])
                  ) {
                    if (
                      ((t = (w.find.ID(a.matches[0].replace(be, we), t) ||
                        [])[0]),
                      !t)
                    )
                      return n;
                    l && (t = t.parentNode),
                      (e = e.slice(o.shift().value.length));
                  }
                  for (
                    r = fe.needsContext.test(e) ? 0 : o.length;
                    r-- && ((a = o[r]), !w.relative[(s = a.type)]);

                  )
                    if (
                      (d = w.find[s]) &&
                      (i = d(
                        a.matches[0].replace(be, we),
                        (_e.test(o[0].type) && u(t.parentNode)) || t
                      ))
                    ) {
                      if ((o.splice(r, 1), (e = i.length && c(o)), !e))
                        return Y.apply(n, i), n;
                      break;
                    }
                }
                return (
                  (l || T(e, p))(
                    i,
                    t,
                    !N,
                    n,
                    (_e.test(e) && u(t.parentNode)) || t
                  ),
                  n
                );
              }),
              (b.sortStable =
                M.split("")
                  .sort(V)
                  .join("") === M),
              (b.detectDuplicates = !!O),
              L(),
              (b.sortDetached = i(function(e) {
                return 1 & e.compareDocumentPosition(G.createElement("div"));
              })),
              i(function(e) {
                return (
                  (e.innerHTML = "<a href='#'></a>"),
                  "#" === e.firstChild.getAttribute("href")
                );
              }) ||
                r("type|href|height|width", function(e, t, n) {
                  return n
                    ? void 0
                    : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
                }),
              (b.attributes &&
                i(function(e) {
                  return (
                    (e.innerHTML = "<input/>"),
                    e.firstChild.setAttribute("value", ""),
                    "" === e.firstChild.getAttribute("value")
                  );
                })) ||
                r("value", function(e, t, n) {
                  return n || "input" !== e.nodeName.toLowerCase()
                    ? void 0
                    : e.defaultValue;
                }),
              i(function(e) {
                return null == e.getAttribute("disabled");
              }) ||
                r(te, function(e, t, n) {
                  var i;
                  return n
                    ? void 0
                    : e[t] === !0
                    ? t.toLowerCase()
                    : (i = e.getAttributeNode(t)) && i.specified
                    ? i.value
                    : null;
                }),
              (SIZZLE_EXT.Sizzle = e);
          })();
          var _slice = Array.prototype.slice;
          try {
            _slice.call(document.documentElement);
          } catch (e) {
            Array.prototype.slice = function(e, t) {
              if (
                ((t = "undefined" != typeof t ? t : this.length),
                "[object Array]" === Object.prototype.toString.call(this))
              )
                return _slice.call(this, e, t);
              var n,
                i,
                r = [],
                o = this.length,
                a = e || 0;
              a = a >= 0 ? a : o + a;
              var s = t ? t : o;
              if ((0 > t && (s = o + t), (i = s - a), i > 0))
                if (((r = new Array(i)), this.charAt))
                  for (n = 0; i > n; n++) r[n] = this.charAt(a + n);
                else for (n = 0; i > n; n++) r[n] = this[a + n];
              return r;
            };
          }
          String.prototype.trim ||
            (String.prototype.trim = function() {
              return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            });
          var pendo = (window.pendo = window.pendo || {}),
            _ = (pendo._ = UNDERSCORE_EXT._),
            Sizzle = (pendo.Sizzle = SIZZLE_EXT.Sizzle),
            Zlib = (pendo.Zlib = {}),
            ENV = "prod",
            VERSION = (pendo.VERSION = "2.15.16_prod"),
            getUA = function() {
              return navigator.userAgent;
            },
            getVersion = function() {
              return isBrowserInQuirksmode()
                ? VERSION + "+quirksmode"
                : VERSION;
            },
            pendoLocalStorage = (function() {
              var e = _.noop,
                t = { getItem: e, setItem: e, removeItem: e };
              try {
                var n = window.localStorage;
                return n ? n : t;
              } catch (i) {
                return t;
              }
            })(),
            q = (function() {
              var e = {},
                t = function() {
                  var e = !1;
                  return function(t) {
                    return function() {
                      e || ((e = !0), t.apply(null, arguments));
                    };
                  };
                },
                n = function(e) {
                  var t = e && e.then;
                  return "object" == typeof e && "function" == typeof t
                    ? function() {
                        return t.apply(e, arguments);
                      }
                    : void 0;
                },
                i = function(t, n) {
                  var i = e.defer(),
                    r = function(e, t) {
                      setTimeout(function() {
                        var n;
                        try {
                          n = e(t);
                        } catch (r) {
                          return void i.reject(r);
                        }
                        n === i.promise
                          ? i.reject(
                              new TypeError(
                                "Cannot resolve promise with itself"
                              )
                            )
                          : i.resolve(n);
                      }, 1);
                    },
                    a = function(e) {
                      t && t.call ? r(t, e) : i.resolve(e);
                    },
                    s = function(e) {
                      n && n.call ? r(n, e) : i.reject(e);
                    };
                  return {
                    promise: i.promise,
                    handle: function(e, t) {
                      e === o ? a(t) : s(t);
                    }
                  };
                },
                r = 0,
                o = 1,
                a = 2;
              return (
                (e.defer = function() {
                  var e,
                    s = r,
                    d = [],
                    u = function(t, n) {
                      (s = t),
                        (e = n),
                        _.each(d, function(t) {
                          t.handle(s, e);
                        }),
                        (d = null);
                    },
                    l = function(e) {
                      u(o, e);
                    },
                    c = function(e) {
                      u(a, e);
                    },
                    p = function(t, n) {
                      var o = i(t, n);
                      return s === r ? d.push(o) : o.handle(s, e), o.promise;
                    },
                    f = function(e) {
                      var n = t();
                      try {
                        e(n(h), n(c));
                      } catch (i) {
                        n(c)(i);
                      }
                    },
                    h = function(e) {
                      var t;
                      try {
                        t = n(e);
                      } catch (i) {
                        return void c(i);
                      }
                      t ? f(t) : l(e);
                    },
                    g = t();
                  return {
                    resolve: g(h),
                    reject: g(c),
                    promise: {
                      then: p,
                      fail: function(e) {
                        return p(null, e);
                      }
                    }
                  };
                }),
                e
              );
            })();
          (q.all = function(e) {
            var t = q.defer(),
              n = _.isArray(e) ? [] : {},
              i = _.size(e),
              r = !1;
            return (
              _.each(e, function(e, o) {
                q.resolve(e).then(
                  function(e) {
                    (n[o] = e), 0 !== --i || r || t.resolve(n);
                  },
                  function(e) {
                    r || ((r = !0), t.reject(e));
                  }
                );
              }),
              t.promise
            );
          }),
            (q.reject = function(e) {
              var t = q.defer();
              return t.reject(e), t.promise;
            }),
            (q.resolve = function(e) {
              var t = q.defer();
              return t.resolve(e), t.promise;
            });
          var makeSafe = function(e) {
            return function() {
              try {
                return e.apply(this, arguments);
              } catch (t) {
                writeException(t);
              }
            };
          };
          pendo.events = (function() {
            var e = Eventable.call({});
            return (
              _.each(
                [
                  "ready",
                  "guidesFailed",
                  "guidesLoaded",
                  "validateGuide",
                  "validateLauncher",
                  "validateGlobalScript"
                ],
                function(t) {
                  e[t] = function(n) {
                    return _.isFunction(n)
                      ? e.on(t, n)
                      : e.trigger.apply(e, [t].concat(_.toArray(arguments)));
                  };
                }
              ),
              e
            );
          })();
          var whenLoadedCall = function(e) {
              "complete" === document.readyState
                ? e()
                : attachEvent(window, "load", e);
            },
            escapeStringsInObject = function(e, t) {
              if ((t || (t = 0), t >= 200)) return e;
              if (_.isArray(e))
                return _.map(e, function(e) {
                  return escapeStringsInObject(e, t + 1);
                });
              if (
                !_.isObject(e) ||
                _.isDate(e) ||
                _.isRegExp(e) ||
                _.isElement(e)
              )
                return _.isString(e) ? _.escape(e) : e;
              var n = {};
              return (
                _.each(e, function(e, i) {
                  n[i] = escapeStringsInObject(e, t + 1);
                }),
                n
              );
            };
          pendo.compress = function(e) {
            var t = pendo.toUTF8Array(JSON.stringify(e)),
              n = new Zlib.Deflate(t),
              i = n.compress(),
              r = pendo.fromByteArray(i);
            return r;
          };
          var crc32 = function(e) {
            if ("undefined" != typeof e) {
              _.isString(e) || (e = JSON.stringify(e));
              var t = pendo.toUTF8Array(e);
              return Zlib.CRC32.calc(t, 0, t.length);
            }
          };
          (pendo.squeezeAndCompress = function(e) {
            var t = pendo.compress(e);
            return t;
          }),
            (pendo.letters = "abcdefghijklmnopqrstuvwxyz"),
            (pendo.charset =
              pendo.letters + pendo.letters.toUpperCase() + "1234567890"),
            (pendo.randomElement = function(e) {
              return e[Math.floor(Math.random() * e.length)];
            }),
            (pendo.randomString = function(e) {
              for (var t = "", n = 0; e > n; n++)
                t += pendo.randomElement(pendo.charset.split(""));
              return t;
            }),
            (pendo.toUTF8Array = function(e) {
              for (var t = [], n = 0; n < e.length; n++) {
                var i = e.charCodeAt(n);
                128 > i
                  ? t.push(i)
                  : 2048 > i
                  ? t.push(192 | (i >> 6), 128 | (63 & i))
                  : 55296 > i || i >= 57344
                  ? t.push(
                      224 | (i >> 12),
                      128 | ((i >> 6) & 63),
                      128 | (63 & i)
                    )
                  : (n++,
                    (i =
                      65536 + (((1023 & i) << 10) | (1023 & e.charCodeAt(n)))),
                    t.push(
                      240 | (i >> 18),
                      128 | ((i >> 12) & 63),
                      128 | ((i >> 6) & 63),
                      128 | (63 & i)
                    ));
              }
              return t;
            });
          var strContains = function(e, t, n) {
              return pendo.doesExist(e) && pendo.doesExist(t)
                ? (n && ((e = e.toLowerCase()), (t = t.toLowerCase())),
                  e.indexOf(t) > -1)
                : !1;
            },
            _hasClass = function(e, t) {
              try {
                var n = new RegExp("(\\s|^)" + t + "(\\s|$)");
                return n.test(_getClass(e));
              } catch (i) {
                return !1;
              }
            },
            _addClass = function(e, t) {
              try {
                if (!_hasClass(e, t)) {
                  var n = _getClass(e).trim() + " " + t;
                  _setClass(e, n);
                }
              } catch (i) {}
            },
            _removeClass = function(e, t) {
              try {
                if (_hasClass(e, t)) {
                  var n = new RegExp("(\\s|^)" + t + "(\\s|$)"),
                    i = _getClass(e).replace(n, " ");
                  _setClass(e, i);
                }
              } catch (r) {}
            },
            _setClass = function(e, t) {
              _.isString(e.className)
                ? (e.className = t)
                : e.setAttribute("class", t);
            },
            _getClass = function(e) {
              try {
                var t = e.className;
                return (
                  (t =
                    _.isString(t) || !pendo.doesExist(t)
                      ? t
                      : e.getAttribute("class")),
                  t || ""
                );
              } catch (n) {
                return "";
              }
            },
            _getCss3Prop = function(e) {
              function t(e) {
                return e.replace(/\-([a-z])/gi, function(e, t) {
                  return t.toUpperCase();
                });
              }
              var n = t(e),
                i = n.substr(0, 1);
              return (n = i.toLowerCase() + n.substr(1));
            },
            cssNumber = {
              columnCount: !0,
              fillOpacity: !0,
              flexGrow: !0,
              flexShrink: !0,
              fontWeight: !0,
              lineHeight: !0,
              opacity: !0,
              order: !0,
              orphans: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0
            },
            setStyle = function(e, t) {
              if (_.isString(t)) {
                var n,
                  i,
                  r,
                  o,
                  a = t.split(";");
                for (t = {}, r = 0; r < a.length; r++)
                  (n = a[r]),
                    (o = n.indexOf(":")),
                    (i = n.substring(0, o)),
                    (t[i] = n.substring(o + 1));
              }
              _.each(t, function(t, n) {
                (n = _getCss3Prop(trim.call(n))),
                  "" !== n &&
                    (!_.isNumber(t) || isNaN(t) || cssNumber[n]
                      ? _.isString(t) || (t = "" + t)
                      : (t = "" + t + "px"),
                    (e.style[n] = trim.call(t)));
              });
            },
            getScreenDimensions = function() {
              if (isBrowserInQuirksmode())
                return {
                  width: document.documentElement.offsetWidth || 0,
                  height: document.documentElement.offsetHeight || 0
                };
              var e = window.innerWidth || document.documentElement.clientWidth,
                t = window.innerHeight || document.documentElement.clientHeight;
              return { width: e, height: t };
            },
            _isInViewport = function(e) {
              var t = getScreenDimensions(),
                n = documentScrollTop(),
                i = documentScrollLeft();
              return (
                e.top >= n &&
                e.left >= i &&
                e.top + e.height <= n + t.height &&
                e.left + e.width <= i + t.width
              );
            },
            removeClass = function(e, t) {
              if ("string" == typeof e) {
                var n = Sizzle(e);
                _.map(n, function(e) {
                  _removeClass(e, t);
                });
              } else _removeClass(e, t);
            },
            addClass = function(e, t) {
              if ("string" == typeof e) {
                var n = Sizzle(e);
                _.map(n, function(e) {
                  _addClass(e, t);
                });
              } else _addClass(e, t);
            },
            removeNode = function(e) {
              e && e.parentNode && e.parentNode.removeChild(e);
            },
            getElements = _.compose(
              function(e) {
                return Array.prototype.slice.call(e);
              },
              function(e) {
                try {
                  return Sizzle(e);
                } catch (t) {
                  return (
                    writeMessage("error using sizzle: " + t),
                    document.getElementsByTagName(e)
                  );
                }
              }
            ),
            pickBestBODY = function(e, t) {
              try {
                var n = t.children.length + t.offsetHeight + t.offsetWidth,
                  i = e.children.length + e.offsetHeight + e.offsetWidth;
                return n - i;
              } catch (r) {
                return (
                  log("error interrogating body elements: " + r),
                  writeMessage("error picking best body:" + r),
                  0
                );
              }
            },
            getBody = function() {
              try {
                var e = getElements("body");
                return e && e.length > 1
                  ? (e.sort(pickBestBODY), e[0] || document.body)
                  : document.body;
              } catch (t) {
                return (
                  writeMessage("Error getting body element: " + t),
                  document.body
                );
              }
            },
            getComputedStyle_safe = function(e) {
              try {
                if (window.getComputedStyle) return getComputedStyle(e);
                if (e.currentStyle) return e.currentStyle;
              } catch (t) {}
            },
            getClientRect = function(e) {
              var t = getBody();
              if (null !== e) {
                if (e === t || e === document || e === window) {
                  var n = {
                    left: window.pageXOffset || t.scrollLeft,
                    top: window.pageYOffset || t.scrollTop,
                    width: window.innerWidth,
                    height: window.innerHeight
                  };
                  return (
                    (n.right = n.left + n.width),
                    (n.bottom = n.top + n.height),
                    n
                  );
                }
                var i = getOffsetPosition(e);
                return (
                  (i.right = i.left + i.width), (i.bottom = i.top + i.height), i
                );
              }
            },
            intersectRect = function(e, t) {
              return e.top >= t.bottom
                ? !1
                : e.bottom <= t.top
                ? !1
                : e.left >= t.right
                ? !1
                : e.right <= t.left
                ? !1
                : !0;
            },
            getScrollParent = function(e, t) {
              t = t || /(auto|scroll|hidden)/;
              var n,
                i,
                r,
                o = getBody();
              if (e === o || !isInDocument(e)) return null;
              for (i = e; i && i != o; ) {
                if (((n = getComputedStyle_safe(i)), !n)) return null;
                if (
                  ((r = n.position),
                  i !== e && t.test(n.overflow + n.overflowY + n.overflowX))
                )
                  return i;
                if (
                  "absolute" === r ||
                  ("fixed" === r && hasParentWithCssTransform(i))
                )
                  i = i.offsetParent;
                else {
                  if ("fixed" === r) return null;
                  i = i.parentNode;
                }
              }
              return o;
            },
            OverflowDirection = { X: "x", Y: "y", BOTH: "both", NONE: "none" };
          _.extend(dom.prototype, {
            findOrCreate: function(e) {
              return this.length > 0 ? this : dom(e);
            },
            find: function(e) {
              var t = dom();
              return (
                (t.context = this.context),
                this.each(function() {
                  dom(e, this).each(function() {
                    t[t.length++] = this;
                  });
                }),
                t
              );
            },
            each: function(e) {
              for (var t = this, n = 0, i = t.length; i > n; ++n)
                e.call(t[n], t[n], n);
              return t;
            },
            html: function(e) {
              return e === undefined
                ? this.length
                  ? this[0].innerHTML
                  : this
                : this.each(function() {
                    this.innerHTML = e;
                  });
            },
            text: function(e) {
              return e === undefined
                ? this.length
                  ? this[0].innerText
                  : this
                : this.each(function() {
                    this.innerText = e;
                  });
            },
            addClass: function(e) {
              return (
                (e = e.split(/\s+/)),
                this.each(function(t) {
                  _.each(e, function(e) {
                    _addClass(t, e);
                  });
                })
              );
            },
            removeClass: function(e) {
              return (
                (e = e.split(/\s+/)),
                this.each(function(t) {
                  _.each(e, function(e) {
                    _removeClass(t, e);
                  });
                })
              );
            },
            hasClass: function(e) {
              e = e.split(/\s+/);
              var t = !0;
              return 0 === this.length
                ? !1
                : (this.each(function(n) {
                    _.each(e, function(e) {
                      t = t && _hasClass(n, e);
                    });
                  }),
                  t);
            },
            toggleClass: function(e) {
              return (
                (e = e.split(/\s+/)),
                this.each(function(t) {
                  _.each(e, function(e) {
                    _hasClass(t, e) ? _removeClass(t, e) : _addClass(t, e);
                  });
                })
              );
            },
            css: function(e) {
              return (
                this.each(function() {
                  setStyle(this, e);
                }),
                this
              );
            },
            appendTo: function(e) {
              return dom(e).append(this), this;
            },
            append: function(e) {
              var t = this;
              return (
                dom(e).each(function() {
                  t.length && t[0].appendChild(this),
                    isInDocument(this) &&
                      _.each(Sizzle("script", this), evalScript);
                }),
                t
              );
            },
            prependTo: function(e) {
              return dom(e).prepend(this), this;
            },
            prepend: function(e) {
              var t = this;
              if (t.length) {
                var n = t[0],
                  i = n.childNodes[0];
                dom(e).each(function() {
                  i ? dom(this).insertBefore(i) : dom(this).appendTo(n);
                });
              }
              return t;
            },
            getParent: function() {
              var e = dom(this)[0];
              return e && e.parentNode ? dom(e.parentNode) : void 0;
            },
            insertBefore: function(e) {
              var t = dom(e)[0];
              t &&
                t.parentNode &&
                (t.parentNode.insertBefore(this[0], t),
                isInDocument(document, this) &&
                  _.each(Sizzle("script", this), evalScript));
            },
            remove: function() {
              return (
                this.each(function() {
                  this.parentNode && this.parentNode.removeChild(this);
                }),
                this
              );
            },
            attr: function(e, t) {
              return t !== undefined
                ? (this.each(function() {
                    this.setAttribute(e, t);
                  }),
                  this)
                : this.length > 0
                ? this[0].getAttribute(e)
                : void 0;
            },
            on: function(e, t, n, i) {
              _.isFunction(t) && ((i = n), (n = t), (t = null));
              var r = function(e) {
                pendo.doesExist(t)
                  ? pendo.dom(getTarget(e)).closest(t).length > 0 &&
                    n.apply(this, arguments)
                  : n.apply(this, arguments);
              };
              return (
                (e = e.split(" ")),
                this.each(function(t) {
                  _.each(e, function(e) {
                    attachEvent(t, e, r, i);
                  });
                }),
                this
              );
            },
            closest: function(e) {
              for (var t = this[0]; t && !Sizzle.matchesSelector(t, e); )
                if (((t = t.parentNode), t === document)) return dom();
              return dom(t);
            },
            eq: function(e) {
              return dom(this[e]);
            },
            height: function(e) {
              return this.length
                ? e === undefined
                  ? this[0].offsetHeight
                  : ((this[0].style.height = e + "px"), this)
                : void 0;
            },
            width: function(e) {
              return this.length
                ? e === undefined
                  ? this[0].offsetWidth
                  : ((this[0].style.width = e + "px"), this)
                : void 0;
            },
            focus: function() {
              return this.each(function() {
                _.isFunction(this.focus) && this.focus();
              });
            }
          }),
            _.extend(dom, {
              removeNode: removeNode,
              getClass: _getClass,
              hasClass: _hasClass,
              addClass: addClass,
              removeClass: removeClass,
              getBody: getBody,
              getComputedStyle: getComputedStyle_safe,
              getClientRect: getClientRect,
              intersectRect: intersectRect,
              getScrollParent: getScrollParent,
              isElementVisible: isElementVisible,
              scrollIntoView: scrollIntoView
            });
          var isValidVisitor = function(e) {
              return (
                pendo.doesExist(e) &&
                "" !== e &&
                "boolean" != typeof e &&
                "object" != typeof e
              );
            },
            isAnonymousVisitor = function(e) {
              return e && "number" != typeof e
                ? e.substring(0, pendo.TEMP_PREFIX.length) === pendo.TEMP_PREFIX
                : !1;
            },
            shouldPersist = function() {
              var e = originalOptions || window.pendo_options || {};
              return !e.disablePersistence;
            },
            DEFAULT_VISITOR_ID = "VISITOR-UNIQUE-ID",
            isDefaultVisitor = function(e) {
              return DEFAULT_VISITOR_ID === e;
            },
            SUBACCOUNT_DELIMITER = "::",
            isSubaccount = function(e) {
              return new RegExp(SUBACCOUNT_DELIMITER).test(e);
            },
            shouldIdentityChange = function(e, t) {
              return isAnonymousVisitor(e)
                ? isValidVisitor(t)
                  ? isAnonymousVisitor(t)
                    ? (pendo.log("visitor is anonymous: " + t), !1)
                    : isDefaultVisitor(t)
                    ? (pendo.log("visitor id is the default: " + t), !1)
                    : (pendo.log("Re-mapping identity from " + e + " to " + t),
                      !0)
                  : (pendo.log("Not valid visitor id: " + t), !1)
                : (pendo.log(
                    "Not change an old, non-anonymous visitor id: " + e
                  ),
                  !1);
            };
          (pendo.identify = makeSafe(function(e, t) {
            var n = "object" == typeof e,
              i = null,
              r = {};
            return (
              (r.old_visitor_id = pendo.get_visitor_id()),
              n &&
                ((i = e),
                (i.visitor = i.visitor || {}),
                (i.account = i.account || {}),
                (i.parentAccount = i.parentAccount || {}),
                (e = i.visitor.id),
                (t = i.account.id),
                t &&
                  !isSubaccount(t) &&
                  i.parentAccount.id &&
                  (t = "" + i.parentAccount.id + SUBACCOUNT_DELIMITER + t),
                updateOptions(i)),
              isValidVisitor(e)
                ? (pendo.set_visitor_id(e),
                  pendo.doesExist(t)
                    ? pendo.set_account_id(t)
                    : (t = pendo.get_account_id()),
                  shouldIdentityChange(r.old_visitor_id, e) &&
                    ((r.visitor_id = e),
                    (r.account_id = t),
                    collectEvent("identify", r),
                    flushLater()),
                  void (r.old_visitor_id !== e && queueGuideReload()))
                : void pendo.log("Invalid visitor id " + e)
            );
          })),
            (pendo.get_visitor_id = function() {
              var e,
                t = pendo.visitorId;
              return (
                (pendo.doesExist(t) && isValidVisitor(t)) ||
                  (shouldPersist()
                    ? ((e = read("visitorId")),
                      isValidVisitor(e) ||
                        ((e = pendo.generate_unique_id(pendo.TEMP_PREFIX)),
                        write("visitorId", e)))
                    : (e = pendo.generate_unique_id(pendo.TEMP_PREFIX)),
                  (pendo.visitorId = e)),
                pendo.visitorId
              );
            }),
            (pendo.set_visitor_id = function(e) {
              (pendo.visitorId = "" + e),
                shouldPersist() &&
                  pendo.set_pendo_cookie(
                    "visitorId",
                    pendo.visitorId,
                    pendo.DEFAULT_EXPIRE_LEN,
                    !0
                  );
            }),
            (pendo.get_account_id = function() {
              if (!pendo.doesExist(pendo.accountId) && shouldPersist()) {
                var e = pendo.read("accountId");
                pendo.accountId = e;
              }
              return pendo.accountId;
            }),
            (pendo.set_account_id = function(e) {
              (pendo.accountId = "" + e),
                shouldPersist() &&
                  pendo.write("accountId", pendo.accountId, null, !1, !0);
            });
          var inMemoryCookies = {},
            getCookie = function(e) {
              var t;
              t = cookiesAreDisabled() ? inMemoryCookies[e] : document.cookie;
              var n;
              return (n = new RegExp("(^|; )" + e + "=([^;]*)").exec(t))
                ? window.decodeURIComponent(n[2])
                : null;
            },
            cookiesAreDisabled = function() {
              var e = originalOptions || window.pendo_options || {};
              return getPendoConfigValue("disableCookies") || e.disableCookies;
            },
            setCookie = function(e, t, n, i) {
              if (!isInPreviewMode()) {
                var r = new Date();
                r.setTime(r.getTime() + n);
                var o =
                  e +
                  "=" +
                  window.encodeURIComponent(t) +
                  (n ? ";expires=" + r.toUTCString() : "") +
                  "; path=/" +
                  ("https" === document.location.protocol || i
                    ? ";secure"
                    : "");
                cookiesAreDisabled()
                  ? (inMemoryCookies[e] = o)
                  : (document.cookie = o);
              }
            },
            getPendoCookieKey = function(e) {
              return "_pendo_" + e + "." + pendo.apiKey;
            };
          (pendo.get_pendo_cookie = function(e) {
            return getCookie(getPendoCookieKey(e));
          }),
            (pendo.DEFAULT_EXPIRE_LEN = 864e7),
            (pendo.set_pendo_cookie = function(e, t, n, i) {
              (n = n || pendo.DEFAULT_EXPIRE_LEN),
                setCookie(getPendoCookieKey(e), t, n, i);
            });
          var readAll = function(e) {
              return read(e, !0);
            },
            read = function(e, t) {
              return t ? getCookie(e) : pendo.get_pendo_cookie(e);
            },
            writeAll = function(e, t, n) {
              return write(e, t, n, !0);
            },
            write = function(e, t, n, i, r) {
              return i
                ? void setCookie(e, t, n, r)
                : pendo.set_pendo_cookie(e, t, n, r);
            },
            clearStorage = function(e) {
              var t = getPendoCookieKey(e);
              document.cookie = t + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            };
          !(function(e, t) {
            e.ajax = t();
          })(pendo, function() {
            function e(e) {
              var t = { status: e.status };
              try {
                t.data = JSON.parse(e.responseText);
              } catch (n) {
                t.data = e.responseText;
              }
              return t;
            }
            function t(t) {
              var n = q.defer(),
                i = window.XMLHttpRequest || ActiveXObject,
                r = new i("MSXML2.XMLHTTP.3.0");
              return (
                r.open(t.method || "GET", t.url, !0),
                _.each(t.headers, function(e, t) {
                  r.setRequestHeader(t.toLowerCase(), e);
                }),
                (r.onreadystatechange = function() {
                  if (4 === r.readyState) {
                    var t = e(r);
                    r.status >= 200 && r.status < 300
                      ? n.resolve(t)
                      : n.reject(t);
                  }
                }),
                t.withCredentials && (r.withCredentials = !0),
                t.data ? r.send(t.data) : r.send(),
                n.promise
              );
            }
            function n(e) {
              return t({ method: "GET", url: e });
            }
            function i(e, n, i) {
              return t({ method: "POST", url: e, data: n, headers: i });
            }
            function r(e, t, n) {
              return (
                n || (n = {}),
                (n["content-type"] = "application/json"),
                (t = JSON.stringify(t)),
                i(e, t, n)
              );
            }
            function o(e, t) {
              var n = _.map(_.keys(t || {}), function(e) {
                  return e + "=" + encodeURIComponent(t[e]);
                }).join("&"),
                i = e.split("#", 2),
                r = i[0],
                o = i[1];
              return [
                encodeURI(r),
                n ? (_.contains(e, "?") ? "&" : "?") + n : "",
                o ? "#" + o : ""
              ].join("");
            }
            function a(e, t) {
              function n() {
                t.destroy && c.parentNode && c.parentNode.removeChild(c);
              }
              function i(e) {
                setTimeout(function() {
                  n(), u({ statusCode: 400 });
                }, e);
              }
              function r() {
                n(), u({ statusCode: 503 });
              }
              function a(e) {
                setTimeout(function() {
                  n(), u({ statusCode: 200 });
                }, e);
              }
              t = _.defaults(t || {}, {
                destroy: !0,
                callback: undefined,
                rejectAfter: 5e3,
                resolveAfter: 500
              });
              var d = q.defer(),
                u = s(d.resolve, d.reject, t.callback),
                l = o(e, { cb: u.uniqueId }),
                c = _.extend(document.createElement("script"), {
                  src: l,
                  onload: _.partial(a, t.resolveAfter),
                  onerror: r
                });
              return document.body.appendChild(c), i(t.rejectAfter), d.promise;
            }
            function s(e, t, n) {
              function i(e) {
                delete window[n];
                var t = (e || {}).statusCode || 204,
                  i =
                    t >= 200 && 400 > t
                      ? this.resolve || _.identity
                      : this.reject || _.identity;
                return i({ body: e, status: t, now: +getNow() });
              }
              var r = { resolve: e, reject: t };
              n = n || "F" + getNow().toString(36);
              var o = window[n] || _.bind(i, r);
              return (window[n] = _.extend(o, { uniqueId: n })), window[n];
            }
            return _.extend(t, {
              get: n,
              post: i,
              postJSON: r,
              urlFor: o,
              jsonp: a
            });
          }),
            (pendo.SIZE_UNIQUE_ID = 11),
            (pendo.generate_unique_id = function(e) {
              return e + pendo.randomString(pendo.SIZE_UNIQUE_ID);
            }),
            (pendo.TEMP_PREFIX = "_PENDO_T_"),
            (pendo.doesExist = function(e) {
              return !("undefined" == typeof e || null === e);
            });
          var shouldRecordTitle = function() {
              var e = originalOptions || window.pendo_options || {};
              return !e.excludeTitle;
            },
            pageLoad = makeSafe(function(e) {
              if (((e = e || pendo.url.get()), e && e !== pageLoad.lastUrl)) {
                pageLoad.lastUrl = e;
                var t = -1;
                announceAgentLoaded(),
                  debug("sending load event for url " + e),
                  "undefined" != typeof performance &&
                    "undefined" != typeof performance.timing &&
                    (t =
                      performance.timing.loadEventStart -
                      performance.timing.fetchStart);
                var n;
                shouldRecordTitle() && (n = document.title),
                  collectEvent("load", { load_time: t, title: n || "" }, e),
                  queueGuideReload(e),
                  flushLater();
              }
            }),
            queueGuideReload = function(e) {
              queueGuideReload.pending &&
                clearTimeout(queueGuideReload.pending),
                (queueGuideReload.pending = setTimeout(function() {
                  delete queueGuideReload.pending, reloadGuides(e);
                }, 0));
            },
            originalOptions = null,
            initialize = makeSafe(function(e) {
              if ((e || (e = {}), _.isString(e)))
                return pendo.ajax.get(e).then(function(e) {
                  return initialize((PendoConfig = e.data));
                });
              (originalOptions = e), (pendo.HOST = HOST = getDataHost());
              var t = getPendoConfigValue("apiKey");
              t ? (pendo.apiKey = t) : e.apiKey && (pendo.apiKey = e.apiKey);
              var n = getPendoConfigValue("additionalApiKeys");
              if (
                (n
                  ? (pendo.additionalApiKeys = n)
                  : e.additionalApiKeys
                  ? (pendo.additionalApiKeys = e.additionalApiKeys)
                  : (pendo.additionalApiKeys = []),
                pendo.additionalApiKeys &&
                  !_.isArray(pendo.additionalApiKeys) &&
                  (pendo.additionalApiKeys = [pendo.additionalApiKeys]),
                !pendo.apiKey &&
                  pendo.additionalApiKeys &&
                  pendo.additionalApiKeys.length &&
                  (pendo.apiKey = pendo.additionalApiKeys[0]),
                !pendo.apiKey)
              )
                return void debug(
                  "API key is not set, Pendo will not initialize."
                );
              pendo.apiKey = "" + pendo.apiKey;
              for (var i = 0; i < pendo.additionalApiKeys.length; i++)
                pendo.additionalApiKeys[i] = "" + pendo.additionalApiKeys[i];
              if (
                ((getOption("excludeAllText") ||
                  getPendoConfigValue("excludeAllText")) &&
                  (pendo.excludeAllText = !0),
                e.logStackTraces && (pendo.logStackTraces = e.logStackTraces),
                (pendo.disableGuideCenterContentSearch =
                  e.disableGuideCenterContentSearch),
                _.each(e.events, function(e, t) {
                  pendo.events[t] && pendo.events[t](e);
                }),
                listenToMaster(),
                initGuides(),
                wirePage(),
                startDebuggingModuleIfEnabled(),
                _.find(
                  [
                    _.partial(pendo.designerv2.launchOnToken, window.location),
                    _.partial(startPreviewMode, window)
                  ],
                  function(e) {
                    return e();
                  }
                ),
                (e.enableDesignerKeyboardShortcut ||
                  !getPendoConfigValue("disableDesignerKeyboardShortcut")) &&
                  pendo.P2AutoLaunch.listen(),
                e.usePendoAgentAPI !== !0 && pendo.updateOptions(e),
                e.visitorId && e.visitorId != DEFAULT_VISITOR_ID)
              )
                pendo.identify(e.visitorId);
              else if (
                e.visitor &&
                e.visitor.id &&
                e.visitor.id != DEFAULT_VISITOR_ID
              ) {
                var r = null;
                e.account && e.account.id && (r = e.account.id),
                  pendo.identify(e.visitor.id, r);
              }
              if (
                (pendo.url.watch(pendo.pageLoad),
                pageLoad(pendo.url.get()),
                !e.ignoreLocalStorageNavigation)
              ) {
                var o = pendoLocalStorage.getItem("pendo-navigation-state");
                if (o)
                  try {
                    var a = JSON.parse(o),
                      s = { lookaside: a.baseUrl, preloader: !0 };
                    pendo.designerv2.launchInAppDesigner(s);
                  } catch (d) {}
              }
              pendo.events.ready();
            }),
            isReady = function() {
              return pendo.doesExist(pendo.apiKey);
            },
            getOption = function(e, t) {
              if (_.isString(e)) {
                for (
                  var n = e.split("."),
                    i = originalOptions,
                    r = 0,
                    o = n.length;
                  o > r;
                  ++r
                ) {
                  if (!pendo.doesExist(i)) return t;
                  i = i[n[r]];
                }
                return pendo.doesExist(i) ? i : t;
              }
              return t;
            };
          pendo.validateInstall = function() {
            if ("undefined" == typeof console || !console.group)
              return "Please run this test in the latest version of Chrome, Firefox, Safari, or Internet Explorer";
            console.group("Pendo Install Validation"),
              pendo.apiKey || console.error("No Pendo API key configured.");
            var e = pendo.get_visitor_id();
            isAnonymousVisitor(e) &&
              console.warn(
                'The current visitor is not identified and will be treated as "anonymous". Is this expected? (You might have used "VISITOR-UNIQUE-ID" as the visitor ID)'
              ),
              isDefaultVisitor(e) &&
                console.error(
                  "The current visitor ID matches the example visitor ID from the Pendo installation instructions."
                );
            var t = pendo.get_account_id();
            t ||
              console.warn(
                "The current visitor is not associated with an account. Is this expected?"
              ),
              "ACCOUNT-UNIQUE-ID" === t &&
                console.error(
                  "The current account ID matches the example account ID from the Pendo installation instructions."
                );
            var n = getMetadata();
            _.each(["visitor", "account", "parentAccount"], function(e) {
              var t = n && n[e],
                i = _.chain(t)
                  .keys()
                  .value();
              i.length > 0
                ? (console.group(e + " metadata (does this look right?):"),
                  _.each(t, function(e, t) {
                    _.isObject(e) && !_.isArray(e)
                      ? console.warn(
                          t + " is an object and will be ignored.",
                          e
                        )
                      : _.isArray(e) && _.any(e, _.isObject)
                      ? console.warn(
                          t +
                            " contains object values. The objects will be ignored.",
                          e
                        )
                      : console.log(t + ":", e);
                  }),
                  console.groupEnd())
                : "parentAccount" !== e &&
                  console.warn(
                    "No " +
                      e +
                      " metadata found. Learn more about metadata here: http://help.pendo.io/resources/support-library/installation/metadata.html"
                  );
            }),
              console.groupEnd();
          };
          var HOST = getDataHost(),
            buildBaseDataUrl = function(e, t, n) {
              getPendoConfigValue("blockLogRemoteAddress") && (n.log = 0);
              var i = HOST + "/data/" + e + "/" + t,
                r = _.map(n, function(e, t) {
                  return t + "=" + e;
                });
              return r.length > 0 && (i += "?" + r.join("&")), i;
            },
            writeGuideEvent = function(e) {
              var t = new Date().getTime(),
                n = pendo.squeezeAndCompress([e]);
              writeBeacon("guide", { ct: t, jzb: n, v: VERSION });
            },
            writeMessage = function(e) {
              (e += "v" + VERSION),
                writeBeacon("log", { msg: e, version: VERSION });
            },
            writeException = function(e, t) {
              if (e && (!e || !e.logged)) {
                t || (t = "pendo.io unhandled exception");
                try {
                  e.logged = !0;
                } catch (n) {}
                var i = "[" + t + ": " + e.message + "]";
                log(i);
                var r = window.pendo_options || {};
                e.stack &&
                pendo.logStackTraces !== !1 &&
                r.logStackTraces !== !1
                  ? writeErrorPOST(i + "\n" + e.stack)
                  : writeMessage(i);
              }
            },
            locked = !1,
            lockEvents = function() {
              return (
                (locked = !0),
                "Pendo Agent locked.  No more events will be written."
              );
            },
            unlockEvents = function() {
              return (
                (locked = !1), "Pendo Agent unlocked.  Events will be written."
              );
            },
            isUnlocked = function() {
              return !locked;
            },
            eventCache = [],
            trackEventCache = [],
            eventHistory = [],
            SEND_INTERVAL = 12e4,
            MAX_NUM_EVENTS = 16,
            URL_MAX_LENGTH = 2e3,
            ENCODED_EVENT_MAX_LENGTH = 1900,
            ENCODED_EVENT_MAX_POST_LENGTH = 65536,
            limitURLSize = function(e, t) {
              return (t = t || getURL()), t.substring(0, e);
            },
            isURLValid = function(e) {
              return !(!e || "" === e);
            },
            getURL = function() {
              return pendo.url.get();
            },
            buffers = (pendo.buffers = {
              flush: flush,
              flushBy: flushBy,
              flushEvents: flushEvents,
              flushTrackEvents: flushTrackEvents,
              flushSilos: flushSilos,
              flushTrackEventSilos: flushTrackEventSilos,
              flushBeacons: flushBeacons,
              flushNow: flushNow,
              flushLater: flushLater,
              flushEvery: flushEvery,
              flushStop: flushStop
            }),
            events = (pendo.buffers.events = eventCache),
            trackEvents = (pendo.buffers.trackEvents = trackEventCache),
            WHITELIST_FREE_NPS = ["load", "meta", "identify"],
            silos = (pendo.buffers.silos = []),
            trackEventSilos = (pendo.buffers.trackEventSilos = []),
            SILO_AVG_COMPRESSION_RATIO = 5,
            SILO_MAX_BYTES =
              ENCODED_EVENT_MAX_LENGTH * SILO_AVG_COMPRESSION_RATIO,
            beacons = (buffers.beacons = []),
            rtrim = /^\s+|\s+$/g,
            trim = String.prototype.trim;
          trim ||
            (trim = function() {
              return this.replace(rtrim, "");
            });
          var evt_map = {
              a: { events: ["click"], attr: ["href"] },
              button: { events: ["click"], attr: ["value", "name"] },
              img: { events: ["click"], attr: ["src", "alt"] },
              select: {
                events: ["mouseup"],
                attr: ["name", "type", "selectedIndex"]
              },
              textarea: { events: ["mouseup"], attr: ["name"] },
              'input[type="submit"]': {
                events: ["click"],
                attr: ["name", "type", "value"]
              },
              'input[type="button"]': {
                events: ["click"],
                attr: ["name", "type", "value"]
              },
              'input[type="radio"]': {
                events: ["click"],
                attr: ["name", "type"]
              },
              'input[type="checkbox"]': {
                events: ["click"],
                attr: ["name", "type"]
              },
              'input[type="password"]': {
                events: ["click"],
                attr: ["name", "type"]
              },
              'input[type="text"]': {
                events: ["click"],
                attr: ["name", "type"]
              }
            },
            handleEmbeddedData = function(e) {
              return e && 0 === e.indexOf("data:")
                ? (debug("Embedded data provided in URI."),
                  e.substring(0, e.indexOf(",")))
                : e + "";
            },
            extractAttribute = function(e, t, n) {
              if (!e || !e.nodeName) return null;
              var i = e.nodeName.toLowerCase();
              if (("img" == i && "src" == t) || ("a" == i && "href" == t)) {
                var r = e.getAttribute(t);
                return sanitizeUrl(handleEmbeddedData(r));
              }
              var o;
              return (
                (o = e.getAttribute ? e.getAttribute(t) : e[t]),
                n && typeof o !== n ? null : o ? o : null
              );
            },
            asString = function(e) {
              return pendo.doesExist(e) ? "" + e : "";
            },
            nodeTypeEnum = {
              TEXT_ELEMENT: 3,
              ELEMENT_NODE: 1,
              DOCUMENT_NODE: 9,
              DOCUMENT_FRAGMENT_NODE: 11,
              CDATA_SECTION_NODE: 4
            },
            extractElementContext = function(e) {
              var t = {};
              if (!e) return t;
              (t.tag = e.nodeName || ""),
                (t.id = asString(e.id)),
                (t.cls = asString(dom.getClass(e))),
                (t.title = extractAttribute(e, "title", "string"));
              var n = (t.tag || "").toLowerCase();
              "input" === n && (n += '[type="' + e.type + '"]'),
                (t.attrs = {}),
                evt_map[n] &&
                  _.each(evt_map[n].attr, function(n) {
                    var i = extractAttribute(e, n);
                    pendo.doesExist(i) && (t.attrs[n] = i);
                  });
              var i = getHtmlAttributeTester(
                getPendoConfigValue("htmlAttributes")
              );
              _.isFunction(i.test) &&
                _.each(e.attributes, function(n) {
                  var r = n.nodeName;
                  i.test(r) &&
                    (t.attrs[r.toLowerCase()] = extractAttribute(e, r));
                });
              var r = getHtmlAttributeTester(
                getPendoConfigValue("htmlAttributeBlacklist")
              );
              if (
                (_.isFunction(r.test) &&
                  (_.each(t.attrs, function(e, n) {
                    r.test(n) && delete t.attrs[n];
                  }),
                  r.test("title") && delete t.title),
                e.parentNode && e.parentNode.childNodes)
              ) {
                var o = _.chain(e.parentNode.childNodes);
                (t.myIndex = o.indexOf(e).value()),
                  (t.childIndex = o
                    .filter(function(e) {
                      return e.nodeType == nodeTypeEnum.ELEMENT_NODE;
                    })
                    .indexOf(e)
                    .value());
              }
              return t;
            },
            isNodeTheRoot = function(e) {
              return "BODY" === e.nodeName || null === e.parentNode;
            },
            extractElementTreeContext = function(e) {
              var t,
                n = {},
                i = n,
                r = e;
              if (!e) return n;
              do {
                t = r;
                var o = extractElementContext(t);
                (i.parentElem = o), (i = o), (r = t.parentNode);
              } while (r && !isNodeTheRoot(t));
              return (
                pendo.excludeAllText !== !0
                  ? (n.parentElem.txt = getText(e, 128))
                  : n.parentElem.value && (n.parentElem.value = null),
                n.parentElem
              );
            },
            buttonNumMap = ["", "left", "right", "middle"],
            buttonLookup = function(e, t) {
              return buttonNumMap[t];
            },
            retTrue = function() {
              return !0;
            },
            getButtonType = function(e) {
              return e.which || e.button;
            },
            identity = function(e) {
              return e;
            },
            propGet = function(e, t) {
              return e[t];
            },
            COMMON_CLICK_ATTRS = [
              ["button", getButtonType, retTrue, buttonLookup],
              ["altKey", propGet, identity, identity],
              ["ctrlKey", propGet, identity, identity],
              ["metaKey", propGet, identity, identity],
              ["shiftKey", propGet, identity, identity]
            ],
            determineClickFlags = function(e, t) {
              for (var n = [], i = 0; i < COMMON_CLICK_ATTRS.length; i++) {
                var r = COMMON_CLICK_ATTRS[i],
                  o = r[0],
                  a = r[1],
                  s = r[2],
                  d = r[3],
                  u = a(e, o);
                s(u) && n.push(d(o, u));
              }
              return (t.flags = n), t;
            },
            evtHandlerExtFn = { click: determineClickFlags },
            getTarget = function(e) {
              return e.target || e.srcElement;
            },
            isElemBlacklisted = function(e) {
              return !e.tagName || "textarea" == e.tagName.toLowerCase();
            },
            getValidTarget = function(e) {
              return e.nodeType === nodeTypeEnum.TEXT_ELEMENT
                ? e.parentNode
                : e.nodeType === nodeTypeEnum.CDATA_SECTION_NODE
                ? null
                : e.correspondingUseElement
                ? e.correspondingUseElement
                : e;
            },
            handle_event = function(e) {
              try {
                var t = getTarget(e),
                  n = e.type,
                  i = {},
                  r = evtHandlerExtFn[n];
                if ((r && (i = r(e, i)), (t = getValidTarget(t)), !t))
                  return void log(
                    "Invalid HTML target",
                    "event",
                    "dom",
                    "processing"
                  );
                var o = extractElementTreeContext(t);
                _.extend(o, i), pageLoad(), collectEvent(n, { target: o });
              } catch (a) {
                writeException(a, "pendo.io while handling event");
              }
            },
            buildErrorEvent = function(e, t, n, i, r) {
              return { msg: e, url: t, lineNum: n, colNum: i, error: r };
            },
            listenForEvents = function(e) {
              _.each(e, function(e) {
                attachEvent(document, e, handle_event, !0);
              });
            },
            DEBOUNCE_INTERVAL_CHANGE = 5e3,
            handle_change_event = _.debounce(
              handle_event,
              DEBOUNCE_INTERVAL_CHANGE,
              !0
            ),
            wirePage = function(e) {
              (e = e || ["click", "focus", "submit", "change"]),
                _.contains(e, "change") &&
                  ((e = _.reject(e, function(e) {
                    return "change" === e;
                  })),
                  attachEvent(document, "change", handle_change_event, !0)),
                listenForEvents(e),
                getPendoConfigValue("xhrTimings") && openXhrIntercept(),
                attachEvent(window, "unload", function() {
                  flushNow(!0);
                }),
                wireTurbolinks();
            },
            wireTurbolinks = function() {
              if ("undefined" != typeof Turbolinks) {
                var e =
                  Turbolinks && Turbolinks.EVENTS && Turbolinks.EVENTS.LOAD;
                e &&
                  attachEvent(document, e, function() {
                    pendo.url.get() === reloadGuides.lastUrl &&
                      (delete reloadGuides.lastUrl, queueGuideReload());
                  });
              }
            },
            PENDO_UID = "pendo-uid",
            eventListenerSet = {},
            attachEvent = function(e, t, n, i) {
              if (e && t && n) {
                if (e === window && "error" === t)
                  return void attachErrorEvent(n);
                i || (i = !1),
                  e.addEventListener
                    ? e.addEventListener(t, n, i)
                    : e.attachEvent("on" + t, n);
              }
            },
            detachEvent = function(e, t, n, i) {
              e &&
                t &&
                n &&
                (i || (i = !1),
                e.removeEventListener
                  ? e.removeEventListener(t, n, i)
                  : e.detachEvent("on" + t, n));
            },
            stopEvent = function(e) {
              e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = !0),
                e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
            },
            sendEvents = function(e, t, n, i) {
              if (e.dispatchEvent) {
                var r = new Event(t, { bubbles: !0, cancelable: !0 });
                if (n && i) {
                  var o = i;
                  r[o] = n;
                }
                return n && !i && _.extend(r, n), e.dispatchEvent(r);
              }
              if (e.fireEvent) {
                var r = document.createEvent("Event");
                if ((r.initEvent(t, !0, !0), n && i)) {
                  var o = i;
                  r[o] = n;
                }
                return n && !i && _.extend(r, n), e.fireEvent("on" + t, r);
              }
              pendo.log("[Agent] Error! Unable to send Action Events");
            },
            getDefaultLogOverride = function(e) {
              var t = readAll("log-enabled");
              return null !== t ? "true" == t : !_.contains(["prod", "rc"], e);
            },
            getDefaultActiveContexts = function() {
              var e = readAll("active-contexts");
              return e ? e.split(",") : [];
            },
            enableLogging = function() {
              return canWeLog()
                ? logOverride
                  ? "logging already enabled"
                  : (writeAll("log-enabled", "true"),
                    (logOverride = !0),
                    "logging enabled")
                : "logging unavailable";
            },
            disableLogging = function() {
              return logOverride
                ? (writeAll("log-enabled", "false"),
                  (logOverride = !1),
                  "logging disabled")
                : "logging already disabled";
            },
            activeContexts = getDefaultActiveContexts(),
            logOverride = getDefaultLogOverride(ENV),
            createContexts = function(e, t) {
              return _.compact([].concat(e, t));
            },
            canWeLog = function() {
              return "undefined" != typeof console && console.log !== undefined;
            },
            shouldWeLog = function(e) {
              return (
                (e = createContexts(e)),
                activeContexts.length > 0
                  ? _.intersection(activeContexts, e).length > 0
                  : !!logOverride || !!pendo.isDebuggingEnabled(!0)
              );
            },
            log = function(e, t) {
              (t = createContexts(t, _.tail(arguments, 2))),
                canWeLog() &&
                  (shouldWeLog(t) && doConsoleLog(e), addToLogHistory(e, t));
            },
            MAX_HISTORY = 100,
            logHistory = [],
            addToLogHistory = function(e, t) {
              _.contains(t, "debug") ||
                (logHistory.length == MAX_HISTORY && logHistory.shift(),
                logHistory.push([e, t]));
            },
            showLogHistory = function(e) {
              (e = createContexts(e)),
                _.each(
                  _.map(
                    _.filter(logHistory, function(t) {
                      return (
                        0 === e.length || _.intersection(e, t[1]).length > 0
                      );
                    }),
                    function(e) {
                      return e[0];
                    }
                  ),
                  function(e) {
                    doConsoleLog(e, "[Pendo-History] ");
                  }
                );
            },
            getLoggedContexts = function() {
              return _.union.apply(
                _,
                _.map(logHistory, function(e) {
                  return e[1];
                })
              );
            },
            getActiveContexts = function() {
              return activeContexts;
            },
            setActiveContexts = function(e) {
              (activeContexts = createContexts(e)),
                writeAll("active-contexts", activeContexts.join(","));
            },
            logUsing = function(e, t) {
              (logOverride || pendo.isDebuggingEnabled(!0)) &&
                ((t = t || "console"), dispatchToRenderer(e, t));
            },
            doConsoleLog = function(e, t) {
              if (canWeLog())
                if (((t = t || "[Agent] "), e && e.length)) {
                  var n = e.length > 1e3 ? e.length - 1e3 : 0;
                  n && (t += "..."), console.log(t + e.substring(n));
                } else console.log(t + e);
            },
            doAlert = function(e) {
              var t = location.href;
              t.indexOf("pendo_alert") > -1 ? window.alert(e) : doConsoleLog(e);
            },
            renderTypeMap = { alert: doAlert, console: doConsoleLog },
            dispatchToRenderer = function(e, t) {
              renderTypeMap[t](e);
            };
          (log.enableLogging = enableLogging),
            (log.disableLogging = disableLogging),
            (log.getActiveContexts = getActiveContexts),
            (log.setActiveContexts = setActiveContexts),
            (log.showLogHistory = showLogHistory),
            (log.getLoggedContexts = getLoggedContexts);
          var isOldIE = function(e, t) {
              return (
                (e = e || 10),
                (t = isNaN(trident) ? !1 : t ? t > trident : !0),
                t && e > msie
              );
            },
            msie,
            trident,
            slice = [].slice,
            push = [].push,
            toString = Object.prototype.toString,
            lowercase = function(e) {
              return isString(e) ? e.toLowerCase() : e;
            },
            determineMSIE = function(e) {
              var t = pint((/msie (\d+)/.exec(lowercase(e)) || [])[1]);
              return (
                isNaN(t) &&
                  (t = pint(
                    (/trident\/.*; rv:(\d+)/.exec(lowercase(e)) || [])[1]
                  )),
                t
              );
            };
          msie = determineMSIE(navigator.userAgent);
          var determineTrident = function(e, t) {
            var n = pint((/trident\/(\d+)/.exec(lowercase(e)) || [])[1]);
            return isNaN(n) && 7 == t && (n = 3), n;
          };
          trident = determineTrident(navigator.userAgent, msie);
          var eventSupport = {},
            android = pint(
              (/android (\d+)/.exec(
                lowercase((window.navigator || {}).userAgent)
              ) || [])[1]
            ),
            boxee = /Boxee/i.test((window.navigator || {}).userAgent),
            pdocument = window.document || {},
            documentMode = pdocument.documentMode,
            vendorPrefix,
            vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,
            bodyStyle = pdocument.body && pdocument.body.style,
            transitions = !1,
            animations = !1,
            match;
          if (bodyStyle) {
            for (var prop in bodyStyle)
              if ((match = vendorRegex.exec(prop))) {
                (vendorPrefix = match[0]),
                  (vendorPrefix =
                    vendorPrefix.substr(0, 1).toUpperCase() +
                    vendorPrefix.substr(1));
                break;
              }
            vendorPrefix ||
              (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"),
              (transitions = !!(
                "transition" in bodyStyle ||
                vendorPrefix + "Transition" in bodyStyle
              )),
              (animations = !!(
                "animation" in bodyStyle ||
                vendorPrefix + "Animation" in bodyStyle
              )),
              !android ||
                (transitions && animations) ||
                ((transitions = isString(
                  pdocument.body.style.webkitTransition
                )),
                (animations = isString(pdocument.body.style.webkitAnimation)));
          }
          pendo._.extend(pendo, {
            sniffer: {
              history: !(
                !window.history ||
                !window.history.pushState ||
                4 > android ||
                boxee
              ),
              hashchange:
                "onhashchange" in window && (!documentMode || documentMode > 7),
              hasEvent: function(e) {
                if ("input" == e && 9 == msie) return !1;
                if (isUndefined(eventSupport[e])) {
                  var t = pdocument.createElement("div");
                  eventSupport[e] = "on" + e in t;
                }
                return eventSupport[e];
              },
              vendorPrefix: vendorPrefix,
              transitions: transitions,
              animations: animations,
              android: android,
              msie: msie,
              msieDocumentMode: documentMode
            }
          });
          var rawDocument = window.document,
            pSetTimeout = window.setTimeout,
            pClearTimeout = window.clearTimeout,
            isElectron = function() {
              return (
                window &&
                window.process &&
                window.process.versions &&
                window.process.versions.electron
              );
            },
            getWindowLocation = function() {
              return window.location;
            },
            electronResourcesPath = function() {
              return window.process.resourcesPath || "";
            },
            electronUserDirectory = function() {
              return window.process.env.PWD || "";
            },
            electronUserHomeDirectory = function() {
              return window.process.env.HOME || "";
            },
            electronAppName = function() {
              return window.process.env.npm_package_name || "";
            },
            getHref = function() {
              var e = pendo.url.getWindowLocation();
              if (pendo.url.isElectron()) {
                var t = pendo.url.electronResourcesPath(),
                  n = pendo.url.electronUserDirectory(),
                  i = pendo.url.electronAppName(),
                  r = "https://" + e.href.replace(t, i);
                return (
                  (r = r.replace(e.origin + n, i)),
                  (r = r.replace(pendo.url.electronUserHomeDirectory(), "")),
                  (r = r.replace("file:///", ""))
                );
              }
              return e.href;
            },
            pollFns = [],
            pollTimeout,
            addPollFn = function(e) {
              return (
                isUndefined(pollTimeout) && startPoller(100, pSetTimeout),
                pollFns.push(e),
                e
              );
            },
            baseElement = pendo.Sizzle("base", document),
            url = function(e) {
              var t;
              try {
                t = getHref();
              } catch (n) {}
              return t;
            },
            urlChangeListeners = [],
            urlChangeInit = !1,
            onUrlChange = function(e) {
              return (
                log("Initializing Pendo URL Watcher"),
                urlChangeInit ||
                  (pendo.sniffer.hashchange &&
                    attachEvent(window, "hashchange", fireUrlChange),
                  addPollFn(fireUrlChange),
                  (urlChangeInit = !0)),
                urlChangeListeners.push(e),
                e
              );
            },
            clearList = function() {
              urlChangeListeners = [];
            },
            getProtocol = function() {
              return document &&
                document.location &&
                "http:" === document.location.protocol
                ? "http:"
                : "https:";
            },
            URL_WHITELIST_KEY = "queryStringWhitelist",
            URL_BLACKLIST_KEY = "queryStringBlacklist",
            externalizeURL = function(e, t, n) {
              (t = t || parseQueryString(e).substring(1)), (e = e || url());
              var i, r;
              (i = e.indexOf(t)), (r = i + t.length);
              var o = e.substring(0, i),
                a = e.substring(r),
                s = n || getOption(URL_WHITELIST_KEY);
              _.isFunction(s) && (s = s()),
                _.isArray(s) && (t = whitelistQueryStringParams(t, s)),
                t.length ||
                  "?" !== o.charAt(o.length - 1) ||
                  (o = o.substr(0, o.length - 1));
              var d = o + t + a;
              return (d = sanitizeUrl(d));
            },
            whitelistQueryStringParams = function(e, t) {
              var n = queryStringToObject(e);
              return (n = _.pick(n, t)), objectToQueryString(n);
            },
            blacklistQueryStringParams = function(e, t) {
              var n = queryStringToObject(e);
              return (n = _.omit(n, t)), objectToQueryString(n);
            },
            queryStringToObject = function(e) {
              var t = e.split("&");
              return _.reduce(
                t,
                function(e, t) {
                  return (t = t.split("=")), (e[t[0]] = t[1]), e;
                },
                {}
              );
            },
            objectToQueryString = function(e) {
              return _.reduce(
                e,
                function(e, t, n) {
                  return e ? e + "&" + n + "=" + t : e + n + "=" + t;
                },
                ""
              );
            };
          pendo._.extend(pendo, {
            url: {
              watch: onUrlChange,
              get: url,
              externalizeURL: externalizeURL,
              getWindowLocation: getWindowLocation,
              clear: clearList,
              isElectron: isElectron,
              electronUserDirectory: electronUserDirectory,
              electronAppName: electronAppName,
              electronUserHomeDirectory: electronUserHomeDirectory,
              electronResourcesPath: electronResourcesPath
            }
          });
          var lastBrowserUrl = getHref(),
            lastSavedOptions = null,
            metadataHash,
            getLocale = function() {
              var e = window.navigator;
              return (
                (pendo._.isArray(e.languages)
                  ? e.languages[0]
                  : e.language ||
                    e.browserLanguage ||
                    e.systemLanguage ||
                    e.userLanguage) || ""
              )
                .split("-")
                .join("_");
            },
            OPTIONS_HASH_KEY_NAME = "meta",
            haveOptionsChanged = function(e) {
              "object" == typeof e && (e = crc32(e)),
                "undefined" != typeof e && e.toString && (e = e.toString());
              var t = _.isNumber(metadataHash)
                ? metadataHash
                : pendo.read(OPTIONS_HASH_KEY_NAME);
              return "" + t !== e ? !0 : !1;
            },
            isScalar = function(e) {
              return _.any(
                [
                  "Number",
                  "Boolean",
                  "Date",
                  "String",
                  "Null",
                  "NaN",
                  "Undefined"
                ],
                function(t) {
                  return _["is" + t](e);
                }
              );
            },
            cleanupMetadata = function(e) {
              var t = {};
              return (
                _.each(e, function(e, n) {
                  isScalar(e)
                    ? (t[n] = e)
                    : _.isArray(e) && (t[n] = _.filter(e, isScalar));
                }),
                t
              );
            },
            prepareOptions = function(e) {
              return (
                _.isObject(e) || (e = {}),
                _.isObject(e.visitor) || (e.visitor = {}),
                _.isObject(e.account) || (e.account = {}),
                _.isObject(e.parentAccount) || (e.parentAccount = {}),
                e.visitor.id === DEFAULT_VISITOR_ID &&
                  (pendo.log("Missing visitor id."), delete e.visitor.id),
                pendo.doesExist(e.account.id) &&
                  pendo.doesExist(e.parentAccount.id) &&
                  (isSubaccount(e.account.id)
                    ? (e.parentAccount.id = e.account.id.split(
                        SUBACCOUNT_DELIMITER
                      )[0])
                    : (e.account.id =
                        "" +
                        e.parentAccount.id +
                        SUBACCOUNT_DELIMITER +
                        e.account.id)),
                pendo.doesExist(e.account.id) &&
                  (pendo.set_account_id(e.account.id),
                  (e.account.id = pendo.get_account_id())),
                pendo.doesExist(e.visitor.id) &&
                  pendo.identify(e.visitor.id, e.account.id),
                (e.visitor.id = pendo.get_visitor_id()),
                (e.visitor.language = getLocale()),
                {
                  visitor: e.visitor,
                  account: cleanupMetadata(e.account),
                  parentAccount: e.parentAccount,
                  date: getDateForOptions(),
                  version: pendo.VERSION
                }
              );
            },
            getDateForOptions = function() {
              var e = new Date(),
                t = e.getDate(),
                n = e.getMonth() + 1,
                i = e.getFullYear();
              return (
                10 > t && (t = "0" + t),
                10 > n && (n = "0" + n),
                (e = t + "/" + n + "/" + i)
              );
            },
            validateOptions = function(e) {
              return e && pendo._.keys(e).length > 0;
            },
            updateOptions = makeSafe(function(e) {
              if (validateOptions(e)) {
                (e = prepareOptions(e)),
                  (getMetadata = function() {
                    return e;
                  });
                var t = crc32(e);
                haveOptionsChanged(t) &&
                  (pendo.write(OPTIONS_HASH_KEY_NAME, t),
                  (lastSavedOptions = e),
                  (metadataHash = t),
                  collectEvent("meta", e),
                  flushLater(),
                  queueGuideReload());
              }
            }),
            getMetadata = function() {};
          (pendo.loadResource = function(e, t) {
            try {
              var n = "text/css",
                i = "text/javascript";
              _.isString(e) && (e = { url: e }),
                (e.type = e.type || /\.css/.test(e.url) ? n : i);
              var r = null,
                o =
                  document.getElementsByTagName("head")[0] ||
                  document.getElementsByTagName("body")[0];
              if (e.type === n) {
                var a = document.createElement("link");
                (a.type = n), (a.rel = "stylesheet"), (a.href = e.url), (r = a);
              } else {
                if (isSfdcLightning()) {
                  var s = document.createElement("script");
                  return (
                    s.addEventListener("load", function() {
                      t(), removeNode(s);
                    }),
                    (s.type = i),
                    (s.src = e.url),
                    document.body.appendChild(s),
                    {}
                  );
                }
                var s = document.createElement("script");
                (s.type = i), (s.async = !0), (s.src = e.url), (r = s);
              }
              return o.appendChild(r), pendo.loadWatcher(r, e.url, t), r;
            } catch (d) {
              return {};
            }
          }),
            (pendo.loadWatcher = function(e, t, n) {
              var i = !1;
              if (
                pendo.doesExist(n) &&
                ((e.onload = function() {
                  i !== !0 && ((i = !0), n(null, t));
                }),
                (e.onerror = function() {
                  pendo.tellMaster({
                    status: "error",
                    msg: "Failed to load script",
                    scriptURL: t
                  });
                }),
                (e.onreadystatechange = function() {
                  i ||
                    (e.readyState &&
                      "loaded" != e.readyState &&
                      "complete" != e.readyState) ||
                    ((i = !0), n(null, t));
                }),
                "link" === e.tagName.toLowerCase())
              ) {
                var r = 500;
                setTimeout(function() {
                  if (!i) {
                    var e = new Image();
                    (e.onload = e.onerror = function() {
                      i !== !0 && ((i = !0), n(null, t));
                    }),
                      (e.src = t);
                  }
                }, r),
                  setTimeout(function() {
                    i ||
                      writeMessage(
                        "Failed to load " + t + " within 10 seconds"
                      );
                  }, 1e4);
              }
            }),
            (pendo.messageLogger = function(e) {
              var t = JSON.parse(e.data),
                n = e.origin;
              debug(
                pendo.app_name +
                  ": Message: " +
                  JSON.stringify(t) +
                  " from " +
                  n
              ),
                pendo.tellMaster(
                  e.source,
                  {
                    status: "success",
                    msg: "ack",
                    originator: "messageLogger"
                  },
                  n
                );
            }),
            (pendo.messageReceiver = function(e) {
              try {
                pendo.messageDispatcher(
                  pendo.messageOriginTester(pendo.messageValidator(e))
                );
              } catch (t) {
                if (!/"type":"frame:/.test(e.data)) {
                  var n =
                    "Error receiving msg: " +
                    JSON.stringify(e.data) +
                    ", Exception: " +
                    t;
                  pendo.log(n);
                }
              }
            }),
            (pendo.messageValidator = function(e) {
              var t = e.data,
                n = e.origin,
                i = e.source;
              if (((t = JSON.parse(t)), !t.type || "string" != typeof t.type))
                throw new Error(
                  "Invalid Message: Missing 'type' in data format"
                );
              return { data: t, origin: n, source: i };
            });
          var trustedOrigin = getTrustedOriginPattern([
            HOST,
            "https://demo.pendo-dev.com",
            "https://app.pendo.io",
            "https?://([a-zA-Z0-9-]+-dot-)?pendo-(dev|test|io|" +
              ENV +
              ").appspot.com"
          ]);
          pendo.messageOriginTester = function(e) {
            if (trustedOrigin.test(e.origin)) return e;
            throw new Error(
              "Received message from untrusted origin " + e.origin
            );
          };
          var designerWindow;
          pendo.onConnectMessage = function(e, t) {
            isUnlocked() &&
              (stopGuides(),
              lockEvents(),
              FrameController.stop(),
              (designerWindow = t.source),
              (window.onbeforeunload = function() {
                unlockEvents(),
                  removeDesignerFunctionality(),
                  pendo.tellMaster(t.source, { type: "unload" }, "*");
              }),
              _.isFunction(detachGuideEventHandlers) &&
                detachGuideEventHandlers(),
              addDesignerFunctionality(),
              pendo.tellMaster(
                t.source,
                { status: "success", type: "connect" },
                "*"
              ),
              pendo.findModuleByName("selection.js") &&
                (pendo.log("Designer Modules already loaded."),
                pendo.tellMaster({ type: "ready" })));
          };
          var onModuleMessage = function(e) {
              pendo.moduleLoader(e.moduleURL);
            },
            onEnableDebug = function(e) {
              window.addEventListener("message", pendo.messageLogger, !1);
            };
          pendo.MESSAGE_TYPES = {
            connect: pendo.onConnectMessage,
            disconnect: function(e) {},
            module: onModuleMessage,
            debug: onEnableDebug
          };
          var registerMessageHandler = function(e, t) {
            pendo.tellMaster({ type: "msg-type-available", "msg-type": e }),
              (pendo.MESSAGE_TYPES[e] = t);
          };
          (pendo.messageDispatcher = function(e) {
            var t = e.data;
            pendo.doesExist(pendo.MESSAGE_TYPES[t.type]) &&
              pendo.MESSAGE_TYPES[t.type](t, e);
          }),
            (pendo.moduleRegistry = {}),
            (pendo.addModule = function(e) {
              if (
                ((pendo.moduleRegistry[e] = {}), "undefined" != typeof CKEDITOR)
              )
                try {
                  CKEDITOR.config.customConfig = "";
                } catch (t) {}
            }),
            (pendo.hasModule = function(e) {
              return pendo.doesExist(pendo.moduleRegistry[e]);
            }),
            (pendo.findModuleByName = function(e) {
              if (!pendo.moduleRegistry) return null;
              var t = function(e, t) {
                return e.indexOf(t) >= 0;
              };
              for (var n in pendo.moduleRegistry) if (t(n, e)) return n;
              return null;
            }),
            (pendo.modulesWaiting = []),
            (pendo.loadModules = function() {
              if (!(pendo.modulesWaiting.length < 1)) {
                var e = pendo.modulesWaiting.shift();
                pendo.hasModule(e) ||
                  pendo.loadResource(e, function() {
                    pendo.addModule(e), pendo.loadModules();
                  });
              }
            }),
            (pendo.moduleLoader = function(e) {
              pendo.modulesWaiting.push(e),
                pendo.modulesWaiting.length > 1 || pendo.loadModules();
            });
          var tellMaster = function(e, t, n) {
              var i = _.uniqueId("pendo-");
              try {
                if (
                  ("undefined" == typeof t &&
                    "undefined" == typeof n &&
                    ((t = e),
                    (e = designerWindow || getDesignerWindow()),
                    (n = "*")),
                  (t.guid = i),
                  e && _.isFunction(e.postMessage))
                ) {
                  var r = JSON.stringify(t);
                  e.postMessage(r, n);
                }
              } catch (o) {
                var a = (o && o.message) || "";
                log("Failed to postMessage: " + a);
              }
              return i;
            },
            detectMaster = function() {
              return window != window.top;
            },
            getDesignerWindow = function() {
              var e = new RegExp("^" + HOST.replace(/^https?:/, "https?:"));
              return e.test(location.href) ? window.parent : window.top;
            },
            announceAgentLoaded = function() {
              if (detectMaster()) {
                var e = getDesignerWindow();
                pendo.tellMaster(
                  e,
                  { type: "load", url: location.toString() },
                  "*"
                );
              }
            },
            listenToMaster = function() {
              (pendo.app_name = document.title),
                detectMaster() &&
                  (pendo.log(pendo.app_name + ": listening to messages"),
                  pendo.doesExist(window.addEventListener) &&
                    window.addEventListener(
                      "message",
                      pendo.messageReceiver,
                      !1
                    )),
                window.opener &&
                  pendo.doesExist(window.addEventListener) &&
                  (window.addEventListener(
                    "message",
                    launchPreviewListener,
                    !1
                  ),
                  window.opener.postMessage({ type: "pendo::ready" }, "*"));
            },
            isBrowserInQuirksmode = function() {
              return isNaN(msie)
                ? !1
                : 11 == msie
                ? !1
                : "CSS1Compat" !== document.compatMode;
            },
            buildArrowDimensionsQM = function(e, t) {
              var n = e.height,
                i = e.width;
              if ("top" == e.arrowPosition || "bottom" == e.arrowPosition) {
                var r = 10,
                  o = 0;
                return (
                  "top" == e.arrowPosition
                    ? ((e.top = t.top + t.height),
                      (o = -1),
                      (e.arrow.top = 3),
                      10 == msie || (9 >= msie && (e.arrow.top = 6)))
                    : "bottom" == e.arrowPosition &&
                      ((e.top = t.top - (n + pendo.TOOLTIP_ARROW_SIZE)),
                      (e.arrow.top = n - pendo.TOOLTIP_ARROW_SIZE),
                      10 == msie
                        ? e.arrow.top--
                        : 9 >= msie && (e.arrow.top += 4),
                      (o = 1)),
                  "left" == e.arrow.hbias
                    ? ((e.left =
                        t.left +
                        t.width / 2 -
                        (r + 2 * pendo.TOOLTIP_ARROW_SIZE)),
                      (e.arrow.left = r + pendo.TOOLTIP_ARROW_SIZE))
                    : "right" == e.arrow.hbias
                    ? ((e.left =
                        t.left -
                        i +
                        t.width / 2 +
                        (r + 2 * pendo.TOOLTIP_ARROW_SIZE)),
                      (e.arrow.left = i - 3 * pendo.TOOLTIP_ARROW_SIZE - r))
                    : ((e.left = t.left + t.width / 2 - i / 2),
                      (e.arrow.left = i / 2 - pendo.TOOLTIP_ARROW_SIZE)),
                  (e.arrow.border.top = e.arrow.top + o),
                  (e.arrow.border.left = e.arrow.left),
                  e
                );
              }
              return (
                "left" == e.arrow.hbias
                  ? ((e.left = t.left + t.width),
                    (e.arrow.left = 1),
                    (e.arrow.left += 5),
                    (e.arrow.border.left = e.arrow.left - 1))
                  : "right" == e.arrow.hbias &&
                    ((e.left = Math.max(
                      0,
                      t.left - i - pendo.TOOLTIP_ARROW_SIZE
                    )),
                    (e.arrow.left = i - pendo.TOOLTIP_ARROW_SIZE - 1),
                    (e.arrow.left += 5),
                    (e.arrow.border.left = e.arrow.left + 1)),
                (e.top = t.top + t.height / 2 - n / 2),
                (e.arrow.top = n / 2 - pendo.TOOLTIP_ARROW_SIZE),
                (e.arrow.border.top = e.arrow.top),
                e
              );
            },
            xhrEventCache = [],
            xhrEventHistory = [],
            MAX_NUM_EVENTS = 16,
            ENCODED_EVENT_MAX_LENGTH = 1900,
            URL_MAX_LENGTH = 2e3,
            limitXhrURLSize = function(e, t) {
              return t.substring(0, e);
            },
            openXhrIntercept = function() {
              attachEvent(window, "unload", processXhrEventCache),
                (function(e) {
                  XMLHttpRequest.prototype.open = function(t, n, i, r, o) {
                    var a = {};
                    this.addEventListener(
                      "readystatechange",
                      function() {
                        var e =
                          arguments[0].target ||
                          arguments[0].srcElement ||
                          arguments[0].currentTarget;
                        modifyXhrData(a, this.readyState, n, t, e);
                      },
                      !1
                    ),
                      e.apply(this, arguments);
                  };
                })(XMLHttpRequest.prototype.open);
            },
            modifyXhrData = function(e, t, n, i, r) {
              if (1 === t) {
                var o = pendo.get_visitor_id();
                e.visitor_id = o;
                var a = pendo.get_account_id();
                (e.account_id = a),
                  (e.browser_url = getScrubbedXhrUrl(
                    pendo.url.getWindowLocation().href
                  )),
                  (e.browser_time = new Date().getTime()),
                  (e.request_method = i),
                  (e.type = "xhr");
              } else
                4 === t &&
                  ((e.request_url = getScrubbedXhrUrl(r.responseURL)),
                  (e.response_status = r.status),
                  (e.duration = new Date().getTime() - e.browser_time),
                  storeInXhrCache(e));
            },
            getScrubbedXhrUrl = function(e) {
              var t = e ? e.indexOf("?") : -1,
                n = -1 === t ? "" : e.slice(t + 1, e.length);
              return externalizeURL(e, n, getPendoConfigValue("xhrWhitelist"));
            },
            handleXhrMaxLengthExceeded = function(e, t) {
              var n = e.request_url,
                i = e.browser_url;
              debug("Max length exceeded for an event"),
                n && n.length > URL_MAX_LENGTH
                  ? (debug("shortening the request URL and retrying"),
                    (e.request_url = limitXhrURLSize(URL_MAX_LENGTH, n)),
                    storeInXhrCache(e))
                  : i && i.length > URL_MAX_LENGTH
                  ? (debug("shortening the browser URL and retrying"),
                    (e.request_url = limitXhrURLSize(URL_MAX_LENGTH, i)),
                    storeInXhrCache(e))
                  : (debug("Couldn't write event"),
                    writeMessage("Single item is: " + t.length + ". Dropping."),
                    writeErrorPOST(t));
            },
            processXhrEventCache = function(e) {
              var t = [].concat(e);
              e.length = 0;
              for (var n = [t]; n.length > 0; ) {
                var i = n.shift(),
                  r = pendo.squeezeAndCompress(i);
                if (r.length > ENCODED_EVENT_MAX_LENGTH)
                  if (1 === i.length) handleXhrMaxLengthExceeded(i[0], r);
                  else {
                    var o = i.length / 2;
                    n.unshift(i.slice(0, o)), n.unshift(i.slice(o));
                  }
                else writeEvent(r, "xhr"), addToXhrHistory(i);
              }
            },
            addToXhrHistory = function(e) {
              xhrEventHistory.push([].concat(e)),
                xhrEventHistory.length > 100 &&
                  (debug("Pruning earliest 50 items from history"),
                  xhrEventHistory.splice(0, 50));
            },
            storeInXhrCache = function(e) {
              xhrEventCache.push(e),
                xhrEventCache.length > MAX_NUM_EVENTS && flushXhrNow();
            },
            flushXhrNow = function() {
              if (xhrEventCache.length > 0)
                try {
                  processXhrEventCache(xhrEventCache);
                } catch (e) {
                  writeException(e, "error while flushing xhr cache");
                }
            },
            waitThenFlushXhr = function(e) {
              flushXhrNow(),
                window.setTimeout(function() {
                  waitThenFlushXhr(e);
                }, e);
            },
            AutoDisplay = (function() {
              function e() {
                p.reset();
              }
              function t(e) {
                return e && /auto/.test(e.launchMethod);
              }
              function n(e) {
                return e.attributes && e.attributes.overrideAutoThrottling;
              }
              function i(e) {
                return _.defaults(
                  _.groupBy(e, function(e) {
                    return n(e) ? "override" : "auto";
                  }),
                  { override: [], auto: [] }
                );
              }
              function r(e, t) {
                function n(e, t) {
                  return i[t] ? (e.push(i[t]), delete i[t], e) : e;
                }
                if (!_.isArray(t) || !t.length) return e;
                var i = _.indexBy(e, "id"),
                  r = _.reduce(t, n, []);
                return _.chain(e)
                  .pluck("id")
                  .reduce(n, r)
                  .value();
              }
              function o(e, n) {
                return i(r(_.filter(e, t), n));
              }
              function a(e) {
                return Math.max(
                  e.latestDismissedAutoAt || -(1 / 0),
                  e.finalAdvancedAutoAt || -(1 / 0)
                );
              }
              function s(e, t) {
                var n = new Date(Math.max(e, 0));
                return (
                  n.setHours(0, 0, 0, 0),
                  n.setDate(n.getDate() + t),
                  n.getTime()
                );
              }
              function d(e, t) {
                var n = t.interval,
                  i = (t.unit || "").toLowerCase();
                if (_.isNumber(n) && isFinite(e)) {
                  if ("minute" === i) return 6e4 * n + e + 1;
                  if ("hour" === i) return 36e5 * n + e + 1;
                  if ("day" === i) return s(e, n);
                } else if (_.isNumber(n)) return new Date().getTime();
              }
              function u(e, t, n) {
                if (n && n.enabled) {
                  var i = d(t, n);
                  if (_.isNumber(i) && !isNaN(i)) return e >= i;
                }
                return !0;
              }
              function l(e) {
                var t;
                return (
                  p.eachUntil(e, function(e) {
                    return (
                      e.shouldAutoDisplay() && e.autoDisplay(),
                      e.isShown() ? ((t = e), !0) : void 0
                    );
                  }),
                  t
                );
              }
              function c(e, t) {
                var n = AutoDisplay.lastDismissedTime(t),
                  i = AutoDisplay.sortAndFilter(e, t.autoOrdering),
                  r = AutoDisplay.display(i.override);
                return (
                  !r &&
                    AutoDisplay.canDisplay(getNow(), n, t.throttling) &&
                    (r = AutoDisplay.display(i.auto)),
                  r
                );
              }
              var p = throttleIterator(
                50,
                createStatefulIterator(function(e) {
                  return e.id;
                })
              );
              return {
                reset: e,
                canDisplay: u,
                display: l,
                lastDismissedTime: a,
                sortAndFilter: o,
                tryDisplay: c,
                getNextAutoDisplayTime: d,
                iterator: p
              };
            })(),
            Permalink = (function() {
              function e(e) {
                var t = e.url.get(),
                  n = {};
                t.replace(new RegExp("([^?=&]+)(=([^&#]*))?", "g"), function(
                  e,
                  t,
                  i,
                  r
                ) {
                  n[t] = r;
                });
                var i = n.pendo;
                return i ? e.findGuideById(i) : null;
              }
              function t(e, t) {
                t.showGuideById(e.id), (e.shownFromPermalink = !0);
              }
              function n(e) {
                return !e.shownFromPermalink;
              }
              function i(e) {
                var t = Permalink.getGuideFromUrl(e);
                return t && Permalink.shouldShowPermalinkGuide(t)
                  ? (Permalink.showPermalinkGuide(t, e), !0)
                  : !1;
              }
              return {
                tryDisplay: i,
                getGuideFromUrl: e,
                showPermalinkGuide: t,
                shouldShowPermalinkGuide: n
              };
            })(),
            ContentLoader = (function(e) {
              function t(t) {
                if (!a[t.id]) {
                  var n = [],
                    i = { deferred: {} },
                    r = !1;
                  if (((a[t.id] = i), GuideLoader.usesXhr() && t.domUrl))
                    (i.deferred.domJson = q.defer()),
                      e.ajax
                        .get(replaceWithContentHost(t.domUrl))
                        .then(function(e) {
                          (i.domJson = e.data), i.deferred.domJson.resolve();
                        }),
                      n.push(i.deferred.domJson.promise),
                      (r = !0);
                  else if (t.domJsonpUrl) {
                    i.deferred.domJson = q.defer();
                    var s = e.loadResource(
                      replaceWithContentHost(t.domJsonpUrl),
                      function() {
                        dom.removeNode(s);
                      }
                    );
                    n.push(i.deferred.domJson.promise), (r = !0);
                  }
                  if (t.contentUrlJs) {
                    i.deferred.content = q.defer();
                    var d = e.loadResource(
                      replaceWithContentHost(o(t.contentUrlJs)),
                      function() {
                        dom.removeNode(d);
                      }
                    );
                    n.push(i.deferred.content.promise),
                      t.contentUrlCss &&
                        ((i.deferred.css = q.defer()),
                        e.loadResource(
                          {
                            url: replaceWithContentHost(t.contentUrlCss),
                            type: "text/css"
                          },
                          function() {
                            i.deferred.css.resolve();
                          }
                        ),
                        n.push(i.deferred.css.promise));
                  } else if (t.contentUrl) {
                    i.deferred.content = q.defer();
                    var u = e.loadResource(
                      replaceWithContentHost(t.contentUrl) + ".js",
                      function() {
                        dom.removeNode(u);
                      }
                    );
                    n.push(i.deferred.content.promise);
                  } else if (!r) return q.reject();
                  i.deferred.promise = q.all(n).then(function() {
                    return _.omit(i, "deferred");
                  });
                }
                return a[t.id].deferred.promise;
              }
              function n() {
                a = {};
              }
              function i(e, t, n, i, r) {
                if (_.isString(n)) {
                  _.isFunction(i) || (i = _.template(n));
                  var o = a[e + t];
                  o &&
                    o.deferred.content &&
                    ((o.content = n),
                    (o.template = i),
                    (o.script = r),
                    o.deferred.content.resolve());
                }
              }
              function r(e, t, n) {
                var i = a[e + t];
                i &&
                  i.deferred.domJson &&
                  ((i.domJson = n), i.deferred.domJson.resolve());
              }
              function o(t) {
                if (isSfdcLightning()) {
                  var n = t
                      .replace(/^https?:\/\/[^\/]+\/guide-content\//, "")
                      .split("/"),
                    i = n[0],
                    r = $A.get(
                      "$Resource.pendoGuide" + base32Encode(e.toUTF8Array(i))
                    );
                  if (_.isString(r)) return r + "/" + n.join("/");
                }
                return t;
              }
              (e.guideContent = i), (e.receiveDomStructureJson = r);
              var a = {};
              return { load: t, reset: n };
            })(pendo),
            BANNER_DEFAULT_HEIGHT = 500,
            BANNER_CSS_NAME = "_pendo-guide-banner_",
            ContentValidation = (function() {
              function e(e) {
                var t = this;
                return (
                  t.before("hide", function() {
                    r = !0;
                  }),
                  t.before("show", function(n) {
                    if (u()) {
                      if (((r = !1), i))
                        return (
                          t.guideId !== i || _.contains(d, t) || d.push(t), !1
                        );
                      var s = c(e);
                      if (s === a) return !1;
                      if (s !== o) {
                        d.push(t);
                        var p = function() {
                          _.each(d, function(e) {
                            e.unlock();
                          }),
                            (d.length = 0),
                            setTimeout(startGuides, 0);
                        };
                        return (
                          t.lock(),
                          l(e).then(function() {
                            _.each(d, function(e) {
                              e.unlock(),
                                r || (e.show(n), t.isShown() || t.hide());
                            }),
                              p();
                          }, p),
                          !1
                        );
                      }
                    }
                  }),
                  (this.signature = function() {
                    var e = [["content", this.content]],
                      t = this.attributes && this.attributes.variables;
                    if (t) {
                      var n = p(t);
                      n.length &&
                        ((n = _.sortBy(n, function(e) {
                          return e[0];
                        })),
                        e.push(["variables", n]));
                    }
                    return e;
                  }),
                  t
                );
              }
              function t() {
                return (
                  (this.signature = function() {
                    return _.map(this.steps, function(e) {
                      return e.signature();
                    });
                  }),
                  this
                );
              }
              function n() {
                var e = this,
                  t = !1,
                  n = function() {
                    return (
                      _.size(pendo.events._handlers.validateLauncher) > 0 &&
                      e.data.template
                    );
                  },
                  i = function() {
                    var t = JSON.stringify(e.signature()),
                      n = "launcher-" + crc32(t);
                    return pendo.events.validateLauncher(t).then(
                      function() {
                        s[n] = o;
                      },
                      function() {
                        s[n] = a;
                      }
                    );
                  },
                  r = function() {
                    var t = "launcher-" + crc32(e.signature());
                    return s[t];
                  };
                return (
                  e.before("update", function() {
                    return n() && t ? !1 : void 0;
                  }),
                  e.before("render", function() {
                    if (n()) {
                      if (t) return !1;
                      var s = r();
                      if (s === a) return !1;
                      if (s !== o)
                        return (
                          (t = !0),
                          i().then(
                            function() {
                              (t = !1), e.render(), e.update(getActiveGuides());
                            },
                            function() {
                              t = !1;
                            }
                          ),
                          !1
                        );
                    }
                  }),
                  (e.signature = function() {
                    var e = [],
                      t = p(this.data);
                    return (
                      t.length &&
                        ((t = _.chain(t)
                          .filter(function(e) {
                            return !/^contentUrl/.test(e[0]);
                          })
                          .sortBy(function(e) {
                            return e[0];
                          })
                          .value()),
                        e.push(["variables", t])),
                      e
                    );
                  }),
                  e
                );
              }
              var i,
                r,
                o = "allow",
                a = "deny",
                s = {},
                d = [],
                u = function() {
                  return _.size(pendo.events._handlers.validateGuide) > 0;
                },
                l = function(e) {
                  return (
                    (i = e.id),
                    e.fetchContent().then(function() {
                      var t = JSON.stringify(e.signature()),
                        n = e.id + "-" + crc32(t);
                      return pendo.events.validateGuide(t, e).then(
                        function() {
                          (i = null), (s[n] = o);
                        },
                        function() {
                          (i = null), (s[n] = a);
                        }
                      );
                    })
                  );
                },
                c = function(e) {
                  var t = e.id + "-" + crc32(e.signature());
                  return s[t];
                },
                p = function(e, t) {
                  var n = [];
                  return (
                    _.each(e, function(e, i) {
                      var r = i;
                      t && (r = t + "." + r),
                        _.isObject(e)
                          ? _.each(p(e, r), function(e) {
                              n.push(e);
                            })
                          : n.push([r, e]);
                    }),
                    n
                  );
                };
              return {
                Step: e,
                Guide: t,
                Launcher: n,
                reset: function() {
                  (s = {}), (i = null), (d.length = 0);
                }
              };
            })(),
            AsyncContent = (function() {
              function e(e) {
                function t() {
                  a = !0;
                }
                function n(e) {
                  return (
                    r(d),
                    (a = !1),
                    pendo.doesExist(s.content) || pendo.doesExist(s.domJson)
                      ? void 0
                      : (s.lock(),
                        s.fetchContent().then(
                          function() {
                            s.unlock(),
                              a || (s.show(e), s.isShown() || s.hide());
                          },
                          function() {
                            s.unlock();
                          }
                        ),
                        !1)
                  );
                }
                function i() {
                  if (!o) {
                    var e = _.extend(
                      { id: s.guideId + s.id },
                      _.pick(
                        s,
                        "contentUrl",
                        "contentUrlCss",
                        "contentUrlJs",
                        "domJsonpUrl",
                        "domUrl"
                      )
                    );
                    o = ContentLoader.load(e).then(function(e) {
                      _.extend(s, e);
                    });
                  }
                  return o;
                }
                function r(t) {
                  var n = _.indexOf(e.steps, s);
                  _.chain(e.steps)
                    .rest(n + 1)
                    .first(t)
                    .each(function(e) {
                      e.fetchContent();
                    })
                    .value();
                }
                var o,
                  a,
                  s = this,
                  d = 3;
                return (
                  (s.contentUrl || s.domJsonpUrl) &&
                    (_.extend(s, { fetchContent: i }),
                    s.before("hide", t),
                    s.before("show", n)),
                  s
                );
              }
              return (
                (e.reset = function() {
                  ContentLoader.reset();
                }),
                e.reset(),
                e
              );
            })();
          (GuideStep.create = function(e, t) {
            return _.reduce(
              GuideStep.behaviors,
              function(e, n) {
                return n.call(e, t);
              },
              e
            );
          }),
            (GuideStep.isGuideStep = function(e) {
              return !!e && _.isFunction(e.render);
            }),
            (GuideStep.behaviors = [
              Wrappable,
              GuideStep,
              RemoteFrameStep,
              AsyncContent,
              ContentValidation.Step,
              CloseButton,
              Credits,
              Tooltip,
              Lightbox,
              Banner,
              WhatsNew,
              Poll,
              AutoHeight,
              PreviewMode
            ]),
            (GuideErrorThrottle.MAX_ERRORS_PER_MINUTE = 30),
            (Guide.create = function(e) {
              return _.reduce(
                Guide.behaviors,
                function(e, t) {
                  return t.call(e);
                },
                e
              );
            }),
            (Guide.behaviors = [
              Wrappable,
              Guide,
              ContentValidation.Guide,
              GroupGuide,
              WalkthroughGuide,
              GuideErrorThrottle,
              RemoteFrameGuide
            ]),
            (AdvanceTrigger.prototype.add = function() {
              (0 !== _.indexOf(this.guide.steps, this.step) ||
                AdvanceTrigger.shouldAttachHandler(this.guide, this.method)) &&
                (!isBadge(this.guide) || isWalkthrough(this.guide)) &&
                this.setupElementEvent(this.element, this.method);
            }),
            (AdvanceTrigger.prototype.remove = function() {
              this.teardownElementEvent(this.element, this.method);
            }),
            (AdvanceTrigger.prototype.setupElementEvent = function(e, t) {
              this.advanceFn ||
                (this.advanceFn = _.compose(
                  _.bind(this.teardownElementEvent, this, e, t),
                  _.bind(this.step.advance, this.step)
                )),
                AdvanceTrigger.attach(this.step, e, t, this.advanceFn);
            }),
            (AdvanceTrigger.prototype.teardownElementEvent = function(e, t) {
              log("detach onGuideAdvanced", "guide"),
                detachEvent(e, t, this.advanceFn, !0),
                this.step.removeTrigger(this);
            }),
            (AdvanceTrigger.shouldAttachHandler = function(e, t) {
              return (
                !e.isActivatedByEvent(t) ||
                (e.attributes.activation.selector !==
                  e.steps[0].elementPathRule &&
                  !!e.attributes.activation.selector)
              );
            }),
            (AdvanceTrigger.attach = function(e, t, n, i) {
              if (e) {
                for (
                  var r = (AdvanceTrigger.handlers =
                      AdvanceTrigger.handlers || {}),
                    o = (r[e.id] = r[e.id] || []),
                    a = 0;
                  a < o.length;
                  ++a
                ) {
                  var s = o[a];
                  t === s[0] &&
                    n === s[1] &&
                    (detachEvent(t, n, s[2], !0),
                    o.splice(_.indexOf(o, s), 1),
                    a--);
                }
                o.push([t, n, i]),
                  detachEvent(t, n, i, !0),
                  attachEvent(t, n, i, !0);
              }
            });
          var loadGlobalScriptOnce = _.wrap(
              _.once(_.wrap(loadGlobalScript, validateGlobalScript)),
              ignoreEmptyGlobalScript
            ),
            EventRouter = function() {
              function e(e) {
                if (!e.ignore)
                  switch (e.action) {
                    case "advanceGuide":
                      pendo.onGuideAdvanced();
                      break;
                    case "submitPoll":
                      this.submitPoll(e);
                      break;
                    case "dismissGuide":
                      pendo.onGuideDismissed();
                      break;
                    case "showElements":
                      this.setElementDisplay(e, "block");
                      var t = BuildingBlockGuides.findGuideContainerJSON(
                        e.step.domJson
                      );
                      BuildingBlockGuides.recalculateGuideHeight(t.props.id),
                        BuildingBlockGuides.flexAllThings(t.props.id);
                      break;
                    case "hideElements":
                      this.setElementDisplay(e, "none");
                      var t = BuildingBlockGuides.findGuideContainerJSON(
                        e.step.domJson
                      );
                      BuildingBlockGuides.recalculateGuideHeight(t.props.id),
                        BuildingBlockGuides.flexAllThings(t.props.id);
                      break;
                    case "slideElement":
                      this.setElementAnimation(e);
                      break;
                    case "showGuide":
                      pendo.showGuideById(e.params[0].value);
                      break;
                    case "renderResourceCenterModule":
                      BuildingBlockResourceCenter.replaceResourceCenterContent(
                        e.params[0].value
                      );
                      break;
                    case "returnToResourceCenterHome":
                      var n = _.find(pendo.guides, function(e) {
                        return (
                          e.attributes &&
                          e.attributes.resourceCenter &&
                          e.attributes.resourceCenter.isTopLevel
                        );
                      });
                      BuildingBlockResourceCenter.replaceResourceCenterContent(
                        n.id,
                        e.params
                      );
                  }
              }
              function t(e) {
                var t = e.step,
                  n = [];
                if (
                  e.srcElement &&
                  e.srcElement.attributes["data-pendo-poll-type"] &&
                  "yesNo" ===
                    e.srcElement.attributes["data-pendo-poll-type"].value
                ) {
                  var i = e.srcElement.attributes["data-pendo-poll-id"].value,
                    r = e.srcElement.value;
                  n.push({ pollId: i, value: parseInt(r, 10) });
                }
                var o = Sizzle("[data-pendo-poll-id]", t.guideElement[0]);
                (n = n.concat(
                  _.map(o, function(e) {
                    var n = Sizzle(
                      "textarea,input:text,select,input:radio:checked",
                      e
                    );
                    if (n && n.length && n[0].value) {
                      var i = e.attributes["data-pendo-poll-id"].value,
                        r = _.find(t.guide.polls, function(e) {
                          return e.id === i;
                        }),
                        o = n[0].value;
                      return (
                        r && r.numericResponses && (o = parseInt(o, 10)),
                        { pollId: i, value: o }
                      );
                    }
                  })
                )),
                  t.response && n
                    ? t.response(_.compact(n))
                    : pendo.log(
                        "[Agent] Error! Trying to submit a poll response but step does not have response function!"
                      ),
                  t.advance();
              }
              function n(e, t) {
                var n = e.step,
                  i = _.find(e.params, function(e) {
                    return "selectors" === e.name;
                  }).value,
                  r = dom(i, n.guideElement[0]);
                _.each(r, function(e) {
                  e.style.display = t;
                });
              }
              function i(e) {
                var t = _.find(e.params, function(e) {
                    return "selector" === e.name;
                  }).value,
                  n = dom(t, e.step.guideElement[0])[0],
                  i = _.find(e.params, function(e) {
                    return "transition" === e.name;
                  }).value,
                  r = _.find(e.params, function(e) {
                    return "left" === e.name;
                  }).value;
                (n.style.transition = i), (n.style.left = r);
              }
              var r = this;
              return (
                (this.eventable = Eventable.call({})),
                this.eventable.on("pendoEvent", function(e) {
                  r.eventHandler(e);
                }),
                (this.eventHandler = e),
                (this.submitPoll = t),
                (this.setElementDisplay = n),
                (this.setElementAnimation = i),
                this
              );
            },
            ScriptGuideLoader = {
              load: function(e, t) {
                return q.resolve(pendo.loadResource(e, t));
              },
              buildUrl: function(e, t) {
                return buildBaseDataUrl("guide.js", e, t);
              },
              usesXhr: function() {
                return !1;
              }
            },
            GuideLoader = ScriptGuideLoader,
            guideEvtCache = [],
            activeElements = [],
            detachGuideEventHandlers,
            activeGuides = [],
            GUIDE_CSS_NAME = "_pendo-guide_",
            GUIDE_ID_PREFIX = "_pendo_g_",
            lastGuideStepSeen = null,
            seenTime = 0,
            isGuideShown = function() {
              return _.any(getActiveGuides(), function(e) {
                return e.isShown();
              });
            },
            addCloseButton = function(e, t) {
              var n = dom("._pendo-close-guide_", e);
              if (n.length) return n[0];
              (n = dom("<button>")
                .attr("id", "_pendo-close-guide_")
                .attr("aria-label", "close")
                .addClass("_pendo-close-guide_")
                .html("&times;")),
                isBrowserInQuirksmode()
                  ? msie > 9 && n.css({ top: 3 })
                  : 8 === msie
                  ? n.css({ top: 9, right: 2 })
                  : 9 === msie
                  ? n.css({ right: 2, top: 3 })
                  : msie > 9 && n.css({ top: 3 });
              var i = dom("._pendo-guide-container_", e)[0] || e;
              return (
                n.appendTo(i),
                (n[0].onclick = function() {
                  t();
                }),
                n[0]
              );
            },
            findGuideBy = function(e, t) {
              for (var n = getActiveGuides(), i = 0; i < n.length; i++)
                if (n[i][e] === t) return n[i];
              return null;
            },
            findGuideById = function(e) {
              return pendo.findGuideBy("id", e);
            },
            findGuideByName = function(e) {
              return pendo.findGuideBy("name", e);
            },
            findStepInGuide = function(e, t) {
              return e && e.id
                ? ((e = findGuideById(e.id)), e.findStepById(t))
                : null;
            },
            _updateGuideStepStatus = function(e, t, n) {
              var i = pendo.findStepInGuide(findGuideById(e), t);
              i && (i.seenState = n);
            },
            getStepIdFromElement = function(e) {
              for (var t = new RegExp("^" + GUIDE_ID_PREFIX); e; ) {
                if (_.isString(e.id) && t.test(e.id))
                  return e.id.replace(t, "");
                e = e.parentNode;
              }
              return null;
            },
            findStepForGuideEvent = function(e, t) {
              if (
                (e && e.guideId && ((t = e), (e = null)),
                GuideStep.isGuideStep(t))
              )
                return t;
              if (t) {
                var n = findGuideById(t.guideId);
                return n && n.findStepById(t.id);
              }
              var i = _.find(getActiveGuides(), function(e) {
                return e.isShown();
              });
              if (i) {
                var r;
                return (
                  e &&
                    (r = getStepIdFromElement(e.target || e.srcElement || e)),
                  r
                    ? ((t = i.findStepById(r)),
                      t ||
                        writeMessage(
                          "findStepForGuideEvent: step with id " + r
                        ))
                    : ((t = _.find(i.steps, function(e) {
                        return e.isShown();
                      })),
                      t ||
                        writeMessage("findStepForGuideEvent: no step shown")),
                  t
                );
              }
            },
            removeGuideEventListeners = function(e) {
              var t = "element" === e.advanceMethod ? "click" : "mouseover",
                n = pendo.getElementForGuideStep(e);
              "tooltip" === e.type && _.isFunction(e.teardownElementEvent)
                ? e.teardownElementEvent(n, t)
                : detachEvent(n, t, onGuideAdvanced, !0);
            },
            onGuideDismissed = function(e, t) {
              var n = null;
              if (
                (e && e instanceof Object && e.until && (n = e.until),
                (t = findStepForGuideEvent(e, t)),
                !t || !t.id)
              )
                return void stopGuides();
              if (n) return void t.hide({ stayHidden: !0 });
              removeGuideEventListeners(t);
              var i = t.id,
                r = t.guideId,
                o = findGuideById(r),
                a = _.first(o && o.steps),
                s = a && a.seenReason,
                d = o && o.language;
              dismissedGuide(r, i, pendo.get_visitor_id(), s, d);
              var u = getNow();
              _updateGuideStepStatus(r, i, "dismissed"),
                (lastGuideStepSeen = {
                  guideId: r,
                  guideStepId: i,
                  time: u,
                  state: "dismissed",
                  seenReason: s
                }),
                writeLastStepSeenCache(lastGuideStepSeen),
                "auto" === s && writeLatestDismissedAutoAtCache(u),
                t.hide(),
                isGuideShown() || (stopGuides(), startGuides());
            },
            cleanupActiveGuide = function() {
              var e = getActiveGuide();
              e &&
                _.each(e.steps, function(e) {
                  var t = "element" == e.advanceMethod ? "click" : "mouseover",
                    n = pendo.getElementForGuideStep(e);
                  "tooltip" === e.type && _.isFunction(e.teardownElementEvent)
                    ? e.teardownElementEvent(n, t)
                    : detachEvent(n, t, onGuideAdvanced, !0);
                });
            },
            onGuideAdvanced = function(e, t) {
              if (
                (cleanupActiveGuide(),
                log("onGuideAdvanced called", "guides"),
                (t = findStepForGuideEvent(e, t)),
                !t)
              )
                return (
                  log("missing step.  can't advance", ["guides", "error"]),
                  stopGuides(),
                  void writeMessage("onGuideAdvanced: missing step")
                );
              var n = findGuideById(t.guideId),
                i = n && n.language;
              if (e && _.isNumber(e.steps) && e.steps > 1) {
                var r = e.steps - 1,
                  o = _.indexOf(n.steps, t),
                  a = o + r;
                a >= n.steps.length && (a = n.steps.length - 1);
                var s = a;
                e.skip === !0 && (s = o + 1);
                for (var d = o; s > d; ++d)
                  (t = n.steps[d]),
                    advancedGuide(
                      n.id,
                      t.id,
                      pendo.get_visitor_id(),
                      t.seenReason,
                      i
                    ),
                    _updateGuideStepStatus(n.id, t.id, "advanced");
                return onGuideAdvanced(n.steps[a]);
              }
              var u = t.id,
                l = t.guideId,
                c = _.first(n && n.steps),
                p = c && c.seenReason;
              log("advancing guide"),
                advancedGuide(l, u, pendo.get_visitor_id(), p, i),
                log("update guide status"),
                _updateGuideStepStatus(l, u, "advanced");
              var f = new Date().getTime();
              (lastGuideStepSeen = {
                guideId: l,
                guideStepId: u,
                time: f,
                state: "advanced",
                seenReason: p
              }),
                writeLastStepSeenCache(lastGuideStepSeen),
                c &&
                  "auto" === c.seenReason &&
                  writeFinalAdvancedAutoAtCache(f),
                log("stop guide"),
                stopGuides(),
                log("start guides"),
                startGuides();
            },
            onGuidePrevious = function(e, t) {
              if (((t = findStepForGuideEvent(e, t)), !t))
                return (
                  stopGuides(),
                  void writeMessage("onGuidePrevious: missing step")
                );
              var n = (t.id, t.guideId),
                i = findGuideById(n),
                r = _.indexOf(i.steps, t);
              if (0 !== r) {
                var o = "element" == t.advanceMethod ? "click" : "mouseover",
                  a = pendo.getElementForGuideStep(t);
                "tooltip" === t.type && _.isFunction(t.teardownElementEvent)
                  ? t.teardownElementEvent(a, o)
                  : detachEvent(a, o, onGuideAdvanced, !0);
                var s = i.steps[r - 1];
                _updateGuideStepStatus(t.guideId, t.id, "active"),
                  _updateGuideStepStatus(s.guideId, s.id, "active"),
                  (lastGuideStepSeen = {
                    guideId: s.guideId,
                    guideStepId: s.id,
                    time: new Date().getTime(),
                    state: "active"
                  }),
                  writeLastStepSeenCache(lastGuideStepSeen),
                  stopGuides(),
                  startGuides();
              }
            };
          pendo._addCredits = function(e) {
            if (!dom("._pendo-credits_", e).length) {
              var t = dom("<div>")
                .addClass("_pendo-credits_")
                .html('<img src="' + getAssetHost() + '/img/tiny-logo.png" />')
                .css({ bottom: 0, right: pendo.TOOLTIP_ARROW_SIZE });
              activeElements.push(t[0]), t.appendTo(e);
            }
          };
          var getElementForGuideStep = function(e) {
              return e
                ? (e.overrideElement ||
                    isWalkthrough(e.getGuide()) ||
                    (e.overrideElement = findBadgeForStep(e)),
                  e.overrideElement
                    ? e.overrideElement
                    : getElementForTargeting(e))
                : (log("Can't get element for null step"), null);
            },
            getElementForTargeting = function(e) {
              var t,
                n = e.elementPathRule || null;
              return (
                (t = n ? Sizzle(n) : [getBody()]),
                0 === t.length ? null : _.first(t)
              );
            },
            canStepBeRendered = function(e) {
              if (isDismissedUntilReload(e)) return !1;
              if (
                !e.elementPathRule &&
                ("lightbox" === e.type || "whatsnew" === e.type)
              )
                return !0;
              var t = getElementForGuideStep(e);
              return isElementVisible(t);
            },
            getStepDivId = function(e) {
              return GUIDE_ID_PREFIX + e.id;
            },
            setupWatchOnElement = function(e) {
              var t = e.element,
                n = _.first(Sizzle("#" + getStepDivId(e)));
              if (t && n) {
                var i = isElementVisible(t);
                if (i || dom.hasClass(n, "mouseover"))
                  return void setTimeout(function() {
                    setupWatchOnElement(e);
                  }, DEFAULT_TIMER_LENGTH);
                e.hide
                  ? (e.hide(), isGuideShown() || (stopGuides(), startGuides()))
                  : (stopGuides(), startGuides());
              } else
                !t &&
                  n &&
                  (e.hide
                    ? (e.hide(),
                      isGuideShown() || (stopGuides(), startGuides()))
                    : (stopGuides(), startGuides()));
            },
            showPreview = function() {
              return !1;
            },
            findBadgeForStep = function(e) {
              return _.first(Sizzle("#_pendo-badge_" + e.id));
            },
            canStepBeShown = function(e) {
              return isGuideShown()
                ? !1
                : canStepBeRendered(e)
                ? "lightbox" == e.type
                  ? canLightboxStepBeShown(e)
                  : "tooltip" == e.type
                  ? canTooltipStepBeShown(e)
                  : !1
                : !1;
            },
            showGuide = function(e, t) {
              if (!e || !e.guideId) return !1;
              var n = findGuideById(e.guideId);
              if (!n) return !1;
              if (isGuideShown()) {
                var i = findStepForGuideEvent();
                removeGuideEventListeners(i), hideGuides();
              }
              return n.launch(t), n.isShown();
            },
            seenGuide = function(e, t, n, i, r) {
              var o = createGuideEvent({
                type: "guideSeen",
                guideId: e,
                stepId: t,
                visitorId: n,
                reason: i,
                language: r
              });
              stageGuideEvent(o);
            },
            writeLastStepSeenCache = function(e) {
              var t = JSON.stringify(e),
                n = 1e4;
              log(
                "writing " + t + " to a cookie named lastStepAdvanced for " + n
              ),
                pendo._set_cookie("lastStepAdvanced", t, n),
                setPreviewState(e, pendoLocalStorage);
            },
            stagedEventsTimer = null,
            startStagedTimer = function(e) {
              window.clearTimeout(stagedEventsTimer),
                (stagedEventsTimer = window.setTimeout(
                  processGuideEventCache,
                  e
                ));
            },
            stageGuideEvent = function(e, t) {
              (t = t || 500),
                (e.props.duration = new Date().getTime() - seenTime),
                guideEvtCache.push(e),
                startStagedTimer(t);
            },
            getNextStepInMultistep = function(e, t) {
              if ("dismissed" === e.state) return null;
              var n = findGuideById(e.guideId);
              return n.nextStep(e, t || pendo.getCurrentUrl());
            },
            shouldAutoDisplayGuide = function(e, t) {
              var n = findGuideById(e && e.id);
              return n ? n.shouldAutoDisplay(t) : !1;
            };
          pendo.getCurrentUrl = function() {
            return pendo.normalizedUrl || pendo.url.get();
          };
          var isBadge = function(e) {
              return (
                e && e.launchMethod && e.launchMethod.indexOf("badge") >= 0
              );
            },
            isWalkthrough = function(e) {
              return (
                e &&
                e.isMultiStep &&
                !(e.attributes && "group" == e.attributes.type)
              );
            };
          (pendo.testUrlForStep = function(e, t) {
            if (!pendo.doesExist(e)) return !0;
            var n = new RegExp(e),
              i = null,
              r = t.indexOf("?");
            if (-1 == r) i = t;
            else {
              var o = t.substr(0, r),
                a = t.substr(r + 1),
                s = a.split("&");
              i = o + "?" + s.sort().join("&");
            }
            return n.test(i);
          }),
            (pendo.showGuideByName = function(e) {
              var t = pendo.findGuideByName(e);
              return t ? showGuide(_.first(t.steps)) : !1;
            }),
            (pendo.showGuideById = function(e) {
              var t = pendo.findGuideById(e);
              return t ? showGuide(_.first(t.steps)) : !1;
            });
          var applyLastAdvancedCache = function() {
              var e =
                pendo._get_cookie("lastStepAdvanced") ||
                JSON.stringify(getPreviewState(pendoLocalStorage));
              if (e) {
                var t = JSON.parse(e);
                if (!t) return;
                log("applying cookie to guide list " + e),
                  t[0] &&
                    (t = {
                      guideId: t[0],
                      guideStepId: t[1],
                      state: "advanced",
                      time: new Date().getTime()
                    });
                var n = t.guideId,
                  i = t.guideStepId,
                  r = findGuideById(n);
                if (r) {
                  var o = _.first(r.steps);
                  o && t.seenReason && (o.seenReason = t.seenReason);
                  var a = pendo.findStepInGuide(r, i);
                  a &&
                    a.seenState != t.state &&
                    (log(
                      "making sure that seenState = 'advanced' for lastStepAdvanced: " +
                        i
                    ),
                    (a.seenState = t.state));
                }
                log(
                  "updating lastGuideStepSeen so that the state matches our local value for " +
                    i
                ),
                  _.extend(lastGuideStepSeen, t);
              }
            },
            isMobileUserAgent = function() {
              return isPreviewing() && getScreenDimensions().width <= 320
                ? !0
                : /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    getUA()
                  );
            },
            isPreviewing = function() {
              return "undefined" != typeof selmo && !!selmo.isPreviewing;
            },
            resetPendoUI = function() {
              stopGuides(),
                clearLoopTimer(),
                removeAllBadges(),
                hideLauncher(),
                flushLater();
            },
            resetPendoContent = function() {
              pendo.guides &&
                ((activeGuides.length = 0),
                (pendo.guides.length = 0),
                (all_ob_guides.length = 0)),
                clearMode();
            },
            loadGuideJs = (function() {
              var e, t;
              return function(n, i, r) {
                var o = _.uniqueId();
                e = o;
                var a = getMetadata();
                a
                  ? (log("sending metadata: " + JSON.stringify(a), [
                      "guides",
                      "metadata"
                    ]),
                    (i.metadata = a))
                  : log("no metadata to send", ["guides", "metadata"]);
                var s = pendo.compress(i),
                  d = { jzb: s, v: VERSION, ct: new Date().getTime() };
                isDebuggingEnabled(!0) && (d.debug = !0);
                var u = previewGuideLoaderWrapper(
                    GuideLoader,
                    pendoLocalStorage
                  ),
                  l = u.buildUrl(n, d),
                  c = 1e3;
                return (
                  l.length > c &&
                    (debug("Max length exceeded for a guide.js request"),
                    (i.url = limitURLSize(c, i.url)),
                    (s = pendo.compress(i)),
                    (l = u.buildUrl(n, {
                      jzb: s,
                      v: VERSION,
                      ct: new Date().getTime()
                    }))),
                  l.length > URL_MAX_LENGTH
                    ? (debug("Couldn't request guide.js"),
                      writeMessage(
                        "Guide.js url is " +
                          l.length +
                          " characters long. Dropping."
                      ),
                      r("error: guide.js url too long"),
                      writeErrorPOST(l))
                    : u
                        .load(l, function() {
                          o === e
                            ? (r.apply(this, arguments),
                              (t = backupObjectState(pendo, [
                                "guides",
                                "normalizedUrl",
                                "lastGuideStepSeen",
                                "guideWidget",
                                "throttling",
                                "autoOrdering",
                                "olark",
                                "globalJsUrl",
                                "segmentFlags",
                                "latestDismissedAutoAt",
                                "finalAdvancedAutoAt"
                              ])))
                            : _.isFunction(t) && t();
                        })
                        .fail(function(e) {
                          return (
                            451 === e.status &&
                              (pendo.stopGuides(),
                              pendo.stopSendingEvents(),
                              log("not tracking visitor due to 451 response")),
                            q.reject(e)
                          );
                        })
                );
              };
            })(),
            loadGuides = function(e, t, n, i) {
              var r,
                o = q.defer(),
                a = !1;
              log("loading guides for " + n + "...", "guides"),
                (e = e || pendo.apiKey),
                (t = t || pendo.get_visitor_id()),
                (n = pendo.url.externalizeURL(n));
              var s = saveGuideShownState(activeGuides);
              if ((resetPendoUI(), resetPendoContent(), !isURLValid(getURL())))
                return (
                  log(
                    "bad url:  probably local file system",
                    "guides",
                    "error"
                  ),
                  _.isFunction(i) && i("error: invalid url"),
                  o.reject(),
                  o.promise
                );
              var d = {
                visitorId: t,
                accountId: pendo.get_account_id(),
                url: n
              };
              loadGuideJs(e, d, function() {
                !a &&
                  isUnlocked() &&
                  (log("successfully loaded guides for " + n, "guides"),
                  window.pendo.designerEnabled &&
                    "true" !==
                      pendoLocalStorage.getItem("pendo-designer-mode") &&
                    pendo.P2AutoLaunch.attemptToLaunch(),
                  resetPendoUI(),
                  (lastGuideStepSeen = preparePreviewLastGuideStepSeen(
                    window,
                    pendo.lastGuideStepSeen
                  )),
                  (activeGuides = _.map(pendo.guides, GuideFactory)),
                  (activeGuides = preparePreviewGuide(window, activeGuides)),
                  (activeGuides = sortGuidesByPriority(activeGuides)),
                  applyLastAdvancedCache(),
                  (pendo.latestDismissedAutoAt = applyTimerCache(
                    pendo.latestDismissedAutoAt,
                    pendo._get_cookie("latestDismissedAutoAt")
                  )),
                  (pendo.finalAdvancedAutoAt = applyTimerCache(
                    pendo.finalAdvancedAutoAt,
                    pendo._get_cookie("finalAdvancedAutoAt")
                  )),
                  FrameController.updateGuideList(activeGuides),
                  activeGuides.length
                    ? q
                        .all([
                          loadGuideCss(),
                          loadGlobalScriptOnce(
                            replaceWithContentHost(pendo.globalJsUrl)
                          ),
                          loadLauncherContent(
                            upgradeLauncher(pendo.guideWidget, activeGuides)
                          ),
                          loadResourceCenterContentIfPresent(pendo.guides)
                        ])
                        .then(
                          function() {
                            initLauncher(),
                              s(activeGuides),
                              prefetchDomActivatedGuideContent(activeGuides),
                              pendo.events.guidesLoaded(),
                              startGuides(),
                              clearTimeout(r),
                              _.isFunction(i) && i(),
                              o.resolve();
                          },
                          function() {
                            pendo.events.guidesFailed(), o.reject();
                          }
                        )
                    : (pendo.events.guidesLoaded(), o.resolve()));
              });
              var u = getOption("guideTimeout") || getOption("guides.timeout");
              return (
                _.isNumber(u) &&
                  (r = setTimeout(function() {
                    (a = !0), o.reject();
                  }, u)),
                o.promise
              );
            },
            processGuideEventCache = function() {
              var e = [].concat(guideEvtCache);
              (guideEvtCache = []), e.length > 0 && _.map(e, writeGuideEvent);
            },
            getGuideEventCache = function() {
              return guideEvtCache;
            },
            loadResourceCenterContentIfPresent = function(e) {
              return pendo.BuildingBlocks.BuildingBlockResourceCenter.initializeResourceCenter(
                e
              );
            },
            initGuides = function() {
              (guideEvtCache = []),
                attachEvent(window, "unload", processGuideEventCache),
                (detachGuideEventHandlers = attachGuideEventHandlers());
              var e = getOption("guides.tooltip.arrowSize");
              _.isNumber(e) && (pendo.TOOLTIP_ARROW_SIZE = e),
                FrameController.init();
            },
            areGuidesDisabled = function() {
              return (
                getOption("guides.disabled", !1) ||
                getOption("disableGuides", !1)
              );
            },
            areGuidesDelayed = function() {
              return (
                getOption("guides.delay", !1) || getOption("delayGuides", !1)
              );
            },
            setGuidesDisabled = function(e) {
              originalOptions.disableGuides = e;
            },
            pendoPreview = "pendo-preview";
          pendo.guidesProcessingThreadHandle = null;
          var DEFAULT_TIMER_LENGTH = 500,
            waitThenLoop = function(e) {
              (e = e || DEFAULT_TIMER_LENGTH),
                (pendo.guidesProcessingThreadHandle = _.delay(function() {
                  (pendo.guidesProcessingThreadHandle = null), startGuides();
                }, e));
            },
            clearLoopTimer = function() {
              pendo.guidesProcessingThreadHandle &&
                (clearTimeout(pendo.guidesProcessingThreadHandle),
                (pendo.guidesProcessingThreadHandle = null));
            },
            stopGuides = function() {
              AutoDisplay.reset(), removeOverlay(), hideGuides();
              for (var e = 0; e < activeElements.length; e++) {
                var t = activeElements[e];
                t.parentNode.removeChild(t);
              }
              activeElements.length = 0;
            },
            currentMode = "default",
            modeProcMap = {},
            registerMode = function(e, t) {
              modeProcMap[e] = t;
            },
            setMode = function(e) {
              return e && "default" != e
                ? modeProcMap[e]
                  ? void (currentMode = e)
                  : void alert("Bad Mode: " + e)
                : void (currentMode = "default");
            },
            clearMode = _.partial(setMode, "default"),
            startGuides = function() {
              if ((clearLoopTimer(), areGuidesDisabled()))
                return void log("guides are disabled.", "guides", "disabled");
              if (areGuidesDelayed())
                return void log("guides are delayed.", "guides", "delayed");
              try {
                var e = getActiveGuides();
                if (!e || 0 === e.length) return;
                getLoopProc()(e);
              } catch (t) {
                writeException(t, "ERROR in guide-loop");
              } finally {
                waitThenLoop();
              }
            },
            manuallyStartGuides = function() {
              getOption("delayGuides") && delete originalOptions.delayGuides,
                getOption("guides.delay") &&
                  delete originalOptions.guides.delay,
                startGuides();
            },
            getLoopProc = function() {
              return modeProcMap[currentMode]
                ? modeProcMap[currentMode]
                : defaultLoopProc;
            },
            defaultLoopProc = function(e) {
              placeBadgesProc(e),
                launcherProc(e),
                FrameController.updateFrameVisibility(),
                isGuideShown() ? guideShowingProc() : noGuideShowingProc(e),
                updatePreview(document, e, lastGuideStepSeen);
            },
            badgeIterator = throttleIterator(
              50,
              createStatefulIterator(function(e) {
                return e.id;
              })
            ),
            placeBadgesProc = function(e) {
              var t = _.filter(e, isBadge);
              badgeIterator.eachUntil(t, function(e) {
                e.placeBadge();
              });
            },
            launcherProc = function(e) {
              var t = getLauncherGuideList(e);
              updateLauncher(t, !0);
            },
            noGuideShowingProc = function(e) {
              if (!Permalink.tryDisplay(pendo)) {
                var t = _.find(e, function(e) {
                  return e.isContinuation(lastGuideStepSeen);
                });
                return t
                  ? void t.show("continue")
                  : void AutoDisplay.tryDisplay(e, pendo);
              }
            },
            CrossFrame = (function() {
              function e(e) {
                var t = u[e.responseId];
                t && (delete u[e.responseId], t.resolve(e));
              }
              function t() {
                u || ((u = {}), (l = i(p, e)));
              }
              function n(e, t) {
                return function(n) {
                  try {
                    var i = o(n);
                    i &&
                      i.apiKey === pendo.apiKey &&
                      i.type === e &&
                      t.call(this, i);
                  } catch (r) {
                    writeException(r);
                  }
                };
              }
              function i(e, t) {
                var i = n(e, t);
                return (
                  _.isFunction(window.addEventListener) &&
                    window.addEventListener("message", i, !1),
                  _.partial(r, i)
                );
              }
              function r(e) {
                _.isFunction(window.removeEventListener) &&
                  window.removeEventListener("message", e, !1);
              }
              function o(e) {
                try {
                  var t = JSON.parse(e.data);
                  return (
                    (t.window = function() {
                      return e.source;
                    }),
                    (t.reply = function(n) {
                      s(e.source, _.extend({ type: p, responseId: t.guid }, n));
                    }),
                    t
                  );
                } catch (n) {}
              }
              function a() {
                _.isFunction(l) && l(), (u = null);
              }
              function s(e, t) {
                return tellMaster(
                  e,
                  _.extend({ apiKey: pendo.apiKey, frameId: c }, t),
                  "*"
                );
              }
              function d(e, n, i) {
                t();
                var r = s(e, n),
                  o = q.defer();
                if (((u[r] = o), _.isNumber(i)))
                  var a = setTimeout(function() {
                    u && delete u[r], o.reject();
                  }, i);
                return (
                  o.promise.then(function() {
                    clearTimeout(a);
                  }),
                  o.promise
                );
              }
              var u,
                l,
                c = pendo.randomString(32),
                p = "frame:reply";
              return { post: s, request: d, subscribe: i, stop: a };
            })(),
            FrameController = (function() {
              function e() {
                detectMaster()
                  ? (n(), u(), attachEvent(window, "unload", d))
                  : ((V.load = CrossFrame.subscribe(D, p)),
                    (V.unload = CrossFrame.subscribe(P, f)),
                    (V.guideList = CrossFrame.subscribe(R, v)),
                    (V.guideShown = CrossFrame.subscribe(F, y)),
                    (V.guideHidden = CrossFrame.subscribe(U, w)));
              }
              function t(e) {
                return _.any(j, function(t) {
                  return t.shown && t.shown[e.id];
                });
              }
              function n() {
                function e() {
                  CrossFrame.request(window.top, { type: D }, n).then(h, t);
                }
                function t() {
                  clearMode(), (n = Math.min(n + n, 1e3)), i++ < 5 && e();
                }
                var n = 100,
                  i = 0;
                e();
              }
              function i() {
                return !_.isEmpty(j);
              }
              function r(e) {
                return _.chain(j)
                  .filter(function(e) {
                    return e && e.state;
                  })
                  .filter(function(t) {
                    return t.state[e.id];
                  })
                  .filter(function(e) {
                    return "hidden" !== e.visibility;
                  })
                  .map(function(t) {
                    return t.state[e.id];
                  })
                  .value();
              }
              function o() {
                _.each(V, function(e) {
                  e();
                }),
                  clearMode(),
                  (j = {}),
                  (V = {}),
                  (z = {}),
                  (W = {});
              }
              function a(e) {
                return !!z[e.id];
              }
              function s(e) {
                return !!W[e.id];
              }
              function d() {
                CrossFrame.post(window.top, { type: P });
              }
              function u() {
                registerMode(N, c), setMode(N);
              }
              function l(e) {
                placeBadgesProc(e), isGuideShown() && guideShowingProc();
                var t = getLauncherGuideList(e),
                  n = computeLauncherHash(t);
                pendo.doesExist(J) && n !== J && g(e), (J = n);
              }
              function c() {}
              function p(e) {
                (j[e.frameId] = j[e.frameId] || {}),
                  (j[e.frameId].window = e.window),
                  (j[e.frameId].shown = {}),
                  e.reply();
              }
              function f(e) {
                v({ frameId: e.frameId, guide: [] }), delete j[e.frameId];
              }
              function h(e) {
                (V.showGuide = CrossFrame.subscribe(M, T)),
                  (V.hideGuides = CrossFrame.subscribe(H, E)),
                  stopGuides(),
                  registerMode(k, l),
                  setMode(k),
                  g(getActiveGuides());
              }
              function g(e) {
                var t = I(e);
                CrossFrame.post(window.top, {
                  type: R,
                  guides: t,
                  state: _.chain(e)
                    .filter(x)
                    .map(O)
                    .value()
                });
              }
              function v(e) {
                var t = e.frameId;
                (j[t] = j[t] || {}),
                  (j[t].window = j[t].window || e.window),
                  (j[t].shown = j[t].shown || {}),
                  _.each(j[t].guides, function(e, t) {
                    W[t] && !--W[t] && delete W[t];
                  }),
                  (j[t].guides = _.indexBy(I(e.guides), "id")),
                  (j[t].state = _.indexBy(e.state, "id")),
                  _.each(j[t].guides, function(e, t) {
                    W[t] || (W[t] = 0), W[t]++;
                  }),
                  L();
              }
              function m(e) {
                e &&
                  detectMaster() &&
                  CrossFrame.post(window.top, {
                    type: F,
                    guideId: e.guideId,
                    stepId: e.id
                  });
              }
              function y(e) {
                _.each(j, function(t, n) {
                  n !== e.frameId &&
                    CrossFrame.post(t.window(), {
                      type: H,
                      guideId: e.guideId,
                      stepId: e.stepId
                    });
                }),
                  _.each(getActiveGuides(), function(t) {
                    if (t.isShown()) {
                      var n = t.findStepById(e.stepId);
                      n ? n.hide({ onlyThisFrame: !0 }) : t.hide();
                    }
                  }),
                  (j[e.frameId].shown[e.stepId] = !0);
              }
              function b(e, t) {
                detectMaster()
                  ? CrossFrame.post(window.top, {
                      type: U,
                      guideId: e.guideId,
                      stepId: e.id,
                      lastGuideStepSeen: lastGuideStepSeen,
                      options: t
                    })
                  : _.each(j, function(n) {
                      CrossFrame.post(n.window(), {
                        type: H,
                        guideId: e.guideId,
                        stepId: e.id,
                        lastGuideStepSeen: lastGuideStepSeen,
                        options: _.extend({ onlyThisFrame: !0 }, t)
                      }),
                        (n.shown = n.shown || {}),
                        (n.shown[e.id] = !1);
                    });
              }
              function w(e) {
                var t = pendo.findGuideById(e.guideId),
                  n = t && t.findStepById(e.stepId);
                n && n.hide(_.extend({}, { onlyThisFrame: !0 }, e.options)),
                  S(e.lastGuideStepSeen),
                  (j[e.frameId].shown[e.stepId] = !1),
                  startGuides();
              }
              function E(e) {
                if ((S(e.lastGuideStepSeen), e.guideId && e.stepId)) {
                  var t = pendo.findGuideById(e.guideId),
                    n = t && t.findStepById(e.stepId);
                  n && n.hide(e.options);
                } else hideGuides(e.options);
              }
              function S(e) {
                _.extend(lastGuideStepSeen, e),
                  _updateGuideStepStatus(
                    lastGuideStepSeen.guideId,
                    lastGuideStepSeen.guideStepId,
                    lastGuideStepSeen.state
                  ),
                  writeLastStepSeenCache(lastGuideStepSeen);
              }
              function C(e, t) {
                function n() {
                  var r = i.shift();
                  return r
                    ? CrossFrame.request(r.window(), {
                        type: M,
                        stepId: e.id,
                        guideId: e.guideId,
                        reason: t
                      }).then(function(e) {
                        return e.error
                          ? q.reject(e.error)
                          : e.isShown
                          ? e
                          : n();
                      })
                    : q.resolve({ isShown: !1 });
                }
                var i = _.chain(j)
                  .filter(function(t) {
                    return t.guides[e.guideId];
                  })
                  .filter(function(e) {
                    return "hidden" !== e.visibility;
                  })
                  .value();
                return n().then(function(t) {
                  var n = j[t.frameId];
                  return t.isShown && n && (n.shown[e.id] = !0), t;
                });
              }
              function T(e) {
                var t = findGuideById(e.guideId),
                  n = t && t.findStepById(e.stepId);
                n
                  ? (n.show(e.reason), e.reply({ isShown: n.isShown() }))
                  : e.reply({ isShown: !1 });
              }
              function A(e) {
                var t = _.pick(
                  e,
                  "id",
                  "name",
                  "launchMethod",
                  "isMultiStep",
                  "steps",
                  "attributes"
                );
                return (
                  (t.steps = _.map(e.steps, function(e) {
                    return _.pick(
                      e,
                      "attributes",
                      "advanceMethod",
                      "id",
                      "guideId",
                      "elementPathRule",
                      "regexUrlRule",
                      "type",
                      "seenState"
                    );
                  })),
                  t
                );
              }
              function x(e) {
                return (
                  e.steps && e.steps.length && "launcher" !== e.steps[0].type
                );
              }
              function I(e) {
                return _.chain(e)
                  .filter(x)
                  .map(A)
                  .value();
              }
              function O(e) {
                return {
                  id: e.id,
                  shouldBeAddedToLauncher: e.shouldBeAddedToLauncher()
                };
              }
              function L() {
                for (var e = getActiveGuides(), t = 0; t < e.length; ++t) {
                  var n = e[t].id;
                  W[n] || z[n] || e.splice(t--, 1);
                }
                var i = _.indexBy(e, "id"),
                  r = _.chain(j)
                    .map(function(e) {
                      return _.toArray(e.guides);
                    })
                    .flatten(!0)
                    .filter(function(e) {
                      return !i[e.id];
                    })
                    .unique("id")
                    .map(GuideFactory)
                    .value();
                e.push.apply(e, r), sortGuidesByPriority(e);
              }
              function G(e) {
                (z = _.chain(e)
                  .pluck("id")
                  .indexBy()
                  .value()),
                  detectMaster() ? g(e) : L();
              }
              function B() {
                var e = Sizzle("iframe");
                _.each(j, function(t) {
                  var n = _.find(e, function(e) {
                      return e.contentWindow == t.window();
                    }),
                    i = isElementVisible(n)
                      ? "visible"
                      : n
                      ? "hidden"
                      : "unknown";
                  "visible" === t.visibility &&
                    "hidden" === i &&
                    CrossFrame.post(t.window(), { type: H }),
                    (t.visibility = i);
                });
              }
              var N = "paused",
                k = "slave",
                D = "frame:load",
                P = "frame:unload",
                R = "frame:guidelist",
                M = "frame:showguide",
                F = "frame:guideshown",
                U = "frame:guidehidden",
                H = "frame:hideguide",
                z = {},
                W = {},
                j = {},
                V = {};
              return {
                init: e,
                stop: o,
                isInThisFrame: a,
                isInAnotherFrame: s,
                show: C,
                shown: m,
                hide: b,
                updateGuideList: G,
                getState: r,
                hasFrames: i,
                updateFrameVisibility: B,
                isShownInAnotherFrame: t
              };
              var J;
            })(),
            OBM = "onboarding",
            all_ob_guides = [],
            completedGuidesSet = [],
            addCompletedGuides = function(e) {
              (e = [].concat(e)),
                (completedGuidesSet = _.union(completedGuidesSet, e));
            },
            wasGuideAlreadyCompleted = function(e) {
              return _.contains(completedGuidesSet, e);
            },
            shouldSwitchToOBM = function(e) {
              return !1;
            },
            startOBM = function() {
              resetPendoUI(), removeLauncher();
              var e = pendo.guideWidget;
              e &&
                ((e.hidePoweredBy = !0), e.data && (e.data.enableSearch = !1));
              var t = _.extend(
                {
                  addHeight: 70,
                  addWidth: -10,
                  addUISection: buildOBProgressUI
                },
                pendo.guideWidget.data
              );
              createLauncher(t, !1),
                dom(launcherBadge.element).addClass("onboarding"),
                dom(launcherTooltipDiv).addClass("onboarding setup"),
                autoShowLauncherList(getGuideStats()),
                setMode(OBM);
            },
            autoShowLauncherList = function(e) {
              e.percentComplete > 0 || "yes" == read("launcher-closed");
            },
            buildOBProgressUI = function(e) {
              var t = [
                "<div class='_pendo-launcher-onboarding-progress_'>",
                "<div class='_pendo-progress-area-inner_'>",
                "<label class='percentComplete'></label><label>% Complete</label>",
                "<div class='_pendo-progress-bar-outer_'>",
                "<div class='_pendo-progress-bar-inner_'></div>",
                "</div>",
                "</div>",
                "</div>"
              ].join("");
              dom("._pendo-launcher-footer_", e).append(dom(t));
            },
            updateProgressUI = function(e) {
              dom("._pendo-progress-area-inner_ label.percentComplete").html(
                e.percentComplete
              ),
                dom("._pendo-progress-bar-inner_").css(
                  "width: " + e.percentComplete + "%"
                );
            },
            isOB = function(e) {
              return e && e.attributes && !!e.attributes.isOnboarding;
            },
            isOBAndCanShow = function(e) {
              return isOB(e) && isLauncher(e);
            },
            isComplete = function(e) {
              if (wasGuideAlreadyCompleted(e)) return !0;
              var t = _.last(e.steps);
              return (
                e.steps.length > 1 &&
                  "lightbox" == t.type &&
                  (t = _.last(e.steps, 2)[0]),
                "advanced" == t.seenState || "dismissed" == t.seenState
              );
            },
            isSkipped = function(e) {
              return !1;
            },
            isInProgress = function(e) {
              var t = _.pluck(e.steps, "seenState"),
                n = _.any(t, function(e) {
                  return "active" == e;
                });
              return n ? !0 : 2 == _.size(_.uniq(t));
            },
            isNotStarted = function(e) {
              return _.any(_.initial(_.pluck(e.steps, "seenState")), function(
                e
              ) {
                return "dismissed" == e;
              })
                ? !0
                : _.all(_.pluck(e.steps, "seenState"), function(e) {
                    return "undefined" == typeof e;
                  });
            },
            getGuideStats = function(e) {
              e = e || all_ob_guides;
              var t = _.filter(e, isComplete),
                n = _.filter(_.without.apply(_, [e].concat(t)), isSkipped),
                i = _.filter(
                  _.without.apply(_, [e].concat(t, n)),
                  isInProgress
                ),
                r = _.filter(
                  _.without.apply(_, [e].concat(t, n, i)),
                  isNotStarted
                ),
                o = {
                  total: e.length,
                  isCompleted: e.length == t.length + n.length,
                  percentComplete: Math.round(
                    ((t.length + n.length) / e.length) * 100
                  ),
                  completed: t,
                  skipped: n,
                  inProgress: i,
                  notStarted: r
                };
              return o;
            },
            updateOnboardingState = function() {
              var e = getGuideStats(),
                t = dom(launcherTooltipDiv);
              t.removeClass("setup"),
                e.isCompleted
                  ? t.addClass("complete")
                  : t.removeClass("complete");
            },
            isOnboardingCompleted = function() {
              var e = dom(launcherTooltipDiv);
              return e.hasClass("complete");
            },
            ob_proc = function(e) {
              var t = _.filter(e, isOBAndCanShow),
                n = getGuideStats();
              addCompletedGuides(n.completed),
                updateProgressUI(n),
                updateLauncherOnboardingContent(t),
                (updateLauncher = function() {
                  return !0;
                }),
                defaultLoopProc(e),
                dom(launcherTooltipDiv).hasClass("setup") ||
                  isOnboardingCompleted() ||
                  !n.isCompleted ||
                  (updateOnboardingState(), onboardingHasCompleted());
            };
          registerMode(OBM, ob_proc);
          var updateLauncherOnboardingContent = function(e) {
              var t = Sizzle(
                "._pendo-launcher_ ._pendo-launcher-guide-listing_"
              );
              return t.length
                ? ((t = t[0]),
                  _.map(e, function(e) {
                    addLauncherItem(t, e);
                  }),
                  e.length)
                : (log("missing luancher body", "launcher", "guides"), !1);
            },
            pickStatusToUse = function(e, t) {
              return "complete" == e ? "complete" : t;
            },
            handleGuideStatusChanges = function(e, t, n) {
              n != t && "complete" == n && guideHasCompleted(e),
                n != t && "skipped" == n && guideWasSkipped(e);
            },
            guideWasSkipped = function(e) {
              guideDone(e);
            },
            guideHasCompleted = function(e) {
              guideDone(e);
            },
            guideDone = function(e) {
              expandLauncherList();
            },
            addLauncherItem = function(e, t) {
              var n,
                i = getOnboardingState(t),
                r = Sizzle("#launcher-" + t.id);
              if (r.length) {
                n = r[0];
                var o = getOnboardingClass(n),
                  a = pickStatusToUse(o, i);
                if (o != a) {
                  var s = dom(n);
                  s.removeClass(makeOBClass("bad")),
                    s.removeClass(makeOBClass(o)),
                    s.addClass(makeOBClass(a));
                }
                handleGuideStatusChanges(t, o, i);
              } else
                (n = buildLauncherItem(t)),
                  dom(n).addClass(makeOBClass(i)),
                  e.appendChild(n);
              return addItemState(t, i, n), n;
            },
            addItemState = function(e, t, n) {
              var i,
                r = Sizzle("._pendo-launcher-item-status_", n);
              r.length
                ? (i = r[0])
                : ((i = dom(
                    "<div class='_pendo-launcher-item-status_'></div>"
                  )[0]),
                  n.appendChild(i));
              var o;
              (o =
                "skipped" == t
                  ? "Task Skipped"
                  : "in-progress" == t
                  ? "Task in Progress (" + renderStepPosition(null, e) + ")"
                  : ""),
                dom(i).html(o);
            },
            makeOBClass = function(e) {
              return "_pendo-onboarding-status-" + e + "_";
            },
            getOnboardingState = function(e) {
              return isComplete(e)
                ? "complete"
                : isSkipped(e)
                ? "skipped"
                : isInProgress(e)
                ? "in-progress"
                : isNotStarted(e)
                ? "not-started"
                : "bad";
            },
            getOnboardingClass = function(e) {
              var t = ["complete", "skipped", "in-progress", "not-started"];
              return e
                ? _.find(t, function(t) {
                    return dom(e).hasClass(makeOBClass(t));
                  })
                : null;
            },
            getActiveGuide = function() {
              var e,
                t,
                n,
                i = _.find(getActiveGuides(), function(e) {
                  return e.isShown();
                });
              return i
                ? ((e = _.find(i.steps, function(e, t) {
                    return (n = t), e.isShown();
                  })),
                  (t = _.filter(i.steps, function(e, t) {
                    return e.isShown();
                  })),
                  { guide: i, steps: t, step: e, stepIndex: n })
                : null;
            },
            smartNextStep = function(e) {
              var t = getActiveGuide();
              if (t) {
                var n = t.guide.steps[t.stepIndex + 1],
                  i = function() {
                    var e = Sizzle(n.elementPathRule);
                    0 !== e.length && pendo._.some(e, isElementVisible)
                      ? pendo.onGuideAdvanced(t.step)
                      : pendo.onGuideAdvanced(n);
                  };
                (e = e || 0), setTimeout(i, e);
              }
            },
            advanceOn = function(e, t) {
              var n = getActiveGuide();
              t = t || n.step.elementPathRule;
              var i = Sizzle(t)[0],
                r = function() {
                  pendo.onGuideAdvanced(), detachEvent(i, e, r, !0);
                };
              attachEvent(i, e, r, !0);
            },
            smartFirstStep = function() {
              dom("._pendo-guide_").css("display:none;");
              var e = pendo.getCurrentUrl(),
                t = getActiveGuide(),
                n = t.guide.steps,
                i = _.filter(_.rest(n), function(e) {
                  return !!e.pageId;
                }),
                r = _.indexOf(
                  n,
                  _.find(i, function(t) {
                    return pendo.testUrlForStep(t.regexUrlRule, e);
                  })
                );
              if ((log("startingPoint is " + r), -1 == r))
                return void dom("._pendo-guide_").css("display:block;");
              var o = n[Math.max(0, r - 1)];
              pendo.log("found starting step to be " + o.id),
                pendo.onGuideAdvanced(o);
            },
            renderStepPosition = function(e, t, n) {
              if (t) {
                if (!n) {
                  var i = [].concat(t.steps).reverse();
                  n = _.findWhere(i, { seenState: "active" });
                }
              } else {
                var r = getActiveGuide();
                if (!r) return;
                (t = r.guide), (n = r.step);
              }
              (e = e || "Step <%= currPos %> of <%= total %>"),
                (e = _.template(e));
              var o = {
                currPos: t.getPositionOfStep(n),
                total: t.getTotalSteps()
              };
              return e(o);
            };
          (pendo.guideDev = {
            getActiveGuide: getActiveGuide,
            smartNextStep: smartNextStep,
            smartFirstStep: smartFirstStep,
            advanceOn: advanceOn,
            renderStepPosition: renderStepPosition
          }),
            (pendo.badgesShown = {});
          var BADGE_CSS_NAME = "_pendo-badge_",
            getElementForBadge = getElementForTargeting;
          (Badge.create = function(e) {
            var t = Badge.findStep(e);
            return t
              ? _.reduce(
                  Badge.behaviors,
                  function(n, i) {
                    return i.call(n, e, t);
                  },
                  e.attributes.badge
                )
              : void 0;
          }),
            (Badge.findStep = function(e) {
              var t = _.find(e.steps, function(e) {
                return !!e.elementPathRule;
              });
              return t && e.attributes && e.attributes.badge ? t : void 0;
            }),
            (Badge.behaviors = [
              Wrappable,
              Badge,
              InlinePosition,
              AbsolutePosition,
              ClickActivation,
              HoverActivation,
              ShowOnHover
            ]);
          var placeBadge = function(e, t) {
              t = t || pendo.badgesShown;
              var n = t[e.id],
                i = n ? n.step() : Badge.findStep(e);
              if (i) {
                var r = n ? n.target() : getElementForBadge(i);
                (e.attributes &&
                  e.attributes.resourceCenter &&
                  !e.hasResourceCenterContent) ||
                  (i.elementPathRule &&
                  pendo.isElementVisible(r) &&
                  pendo.Sizzle.matchesSelector(r, i.elementPathRule)
                    ? (n || (n = Badge.create(e)), n.show(), (t[e.id] = n))
                    : n &&
                      (i.isShown() ||
                        ((i.overrideElement = undefined),
                        (t[e.id] = undefined),
                        n.hide())));
              }
            },
            getBadgeDivForGuide = function(e) {
              var t = pendo.badgesShown[e.id];
              return (t && _.isFunction(t.element) && t.element()) || null;
            },
            removeAllBadges = function() {
              _.map(pendo.badgesShown, removeBadge), (pendo.badgesShown = {});
            },
            removeBadge = function(e) {
              e && _.isFunction(e.hide) && e.hide();
            },
            removeBadgeForGuide = function(e) {
              var t = pendo.badgesShown[e.id];
              t && removeBadge(t);
            },
            adjustBadgesForResize = function(e) {
              debug("adjustBadgesForResize firing"),
                _.map(pendo.badgesShown, function(e) {
                  e && e.show();
                });
            };
          attachEvent(window, "resize", _.debounce(adjustBadgesForResize, 50)),
            (pendo.TOOLTIP_DEFAULT_WIDTH = 430),
            (pendo.TOOLTIP_DEFAULT_HEIGHT = 200),
            (pendo.TOOLTIP_ARROW_SIZE = 15);
          var TOOLTIP_CSS_NAME = "_pendo-guide-tt_",
            MOBILE_TOOLTIP_CSS_NAME = "_pendo-guide-mobile-tt_",
            lastElementPos = null,
            buildTooltipCSSName = function() {
              return isMobileUserAgent()
                ? MOBILE_TOOLTIP_CSS_NAME
                : TOOLTIP_CSS_NAME;
            },
            buildTooltipCSSSelector = function(e) {
              return "#_pendo_g_" + e.id;
            },
            createTooltipGuide = function(e, t) {
              lastElementPos = null;
              var n = getOffsetPosition(e);
              if (0 === n.height && 0 === n.width) return null;
              var i = t.guideElement,
                r = t.attributes.height,
                o = t.attributes.width,
                a = t.attributes.layoutDir;
              i.addClass(buildTooltipCSSName());
              var s = getTooltipDimensions(n, r, o, a);
              t && (t.dim = s),
                i.css({
                  width: s.width,
                  height: s.height,
                  left: s.left,
                  top: s.top
                }),
                n.fixed && i.css({ position: "fixed" });
              dom("._pendo-guide-container_", i)
                .addClass(s.arrowPosition)
                .css({
                  top: s.content.top,
                  left: s.content.left,
                  width: s.content.width,
                  height: s.content.height
                });
              return buildAndAppendArrow(i[0], s), i[0];
            },
            buildAndAppendArrow = function(e, t) {
              var n = ["top", "right", "bottom", "left"],
                i = "_pendo-guide-arrow-",
                r = i + "border-",
                o = t.arrowPosition,
                a = _.chain(n)
                  .filter(function(e) {
                    return e !== o;
                  })
                  .map(function(e) {
                    return (
                      "border-" +
                      e +
                      "-width:" +
                      pendo.TOOLTIP_ARROW_SIZE +
                      "px;"
                    );
                  })
                  .value()
                  .join(""),
                s = dom("div._pendo-guide-arrow_", e)
                  .remove()
                  .findOrCreate("<div class='_pendo-guide-arrow_'></div>"),
                d = dom("div._pendo-guide-arrow-border_ ", e)
                  .remove()
                  .findOrCreate(
                    "<div class='_pendo-guide-arrow-border_'></div>"
                  );
              _.each(n, function(e) {
                s.removeClass(i + e + "_").removeClass(e),
                  d.removeClass(r + e + "_").removeClass(e);
              }),
                s
                  .addClass(i + o + "_")
                  .addClass(o)
                  .css(
                    a + "top:" + t.arrow.top + "px;left:" + t.arrow.left + "px;"
                  ),
                d
                  .addClass(r + o + "_")
                  .addClass(o)
                  .css(
                    a +
                      "top:" +
                      t.arrow.border.top +
                      "px;left:" +
                      t.arrow.border.left +
                      "px;"
                  ),
                dom(e)
                  .append(s)
                  .append(d);
            },
            showTooltipGuide = function(e, t) {
              if (!canTooltipStepBeShown(e)) return null;
              t === undefined && (t = activeElements),
                (e.element = getElementForGuideStep(e));
              var n = e.element;
              if (!n) return log("No element found for step: " + e.id), null;
              scrollIntoView(n);
              var i = createTooltipGuide(n, e);
              return null === i
                ? null
                : ((i.id = pendo.getTooltipDivId(e)),
                  addCloseButton(i, function() {
                    var t = e.getGuide();
                    (!t.isOnboarding() ||
                      confirm(
                        "Are you sure you want to stop this tutorial?"
                      )) &&
                      pendo.onGuideDismissed(e);
                  }),
                  e.hideCredits || pendo._addCredits(i),
                  dom(i).appendTo(getBody()),
                  t.push(i),
                  attachEvent(
                    i,
                    "mouseover",
                    pendo._.partial(dom.addClass, i, "mouseover")
                  ),
                  attachEvent(
                    i,
                    "mouseout",
                    pendo._.partial(dom.removeClass, i, "mouseover")
                  ),
                  scrollToTooltip(n, i),
                  addBlockOutUI(e),
                  n);
            },
            isLessThan = function(e, t) {
              return t > e;
            },
            isGreaterThan = _.negate(isLessThan),
            lastBlockBox = null,
            hasBlockBoxChanged = function(e) {
              var t = !_.isEqual(e, lastBlockBox);
              return (lastBlockBox = e), t;
            },
            lastBodySize = null,
            hasBodyDimensionsChanged = function(e) {
              var t = !_.isEqual(e, lastBodySize);
              return (lastBodySize = e), t;
            },
            lastScreenCoords = null,
            haveScreenCoordsChanged = function(e) {
              var t = !_.isEqual(e, lastScreenCoords);
              return (lastScreenCoords = e), t;
            },
            addBlockOutUI = function(e) {
              try {
                if (
                  !e.attributes ||
                  !e.attributes.blockOutUI ||
                  !e.attributes.blockOutUI.enabled
                )
                  return;
                var t = e.attributes.blockOutUI,
                  n = [];
                n.push(e.element),
                  (n = n.concat(
                    _.compact(
                      _.flatten(
                        _.map([].concat(t.additionalElements), function(e) {
                          return Sizzle(e);
                        })
                      )
                    )
                  ));
                var i = computeBlockOutBoundingBox(n),
                  r = t.padding || 0,
                  o = getClientRect(getBody());
                i.fixed &&
                  ((o.top = 0),
                  (o.bottom = o.height),
                  (o.left = 0),
                  (o.right = o.width));
                var a = computeBlockOutOverlayPositions(o, i, r);
                if (
                  !hasBlockBoxChanged(i) &&
                  !hasBodyDimensionsChanged(o) &&
                  !haveScreenCoordsChanged(a)
                )
                  return;
                var s = { "z-index": t.zindex || 1e4, position: "fixed" };
                t.bgColor && (s["background-color"] = t.bgColor),
                  t.opacity && (s.opacity = t.opacity);
                var d = dom("body");
                _.each(a, function(e, t) {
                  d.append(buildBackdropDiv(t, _.extend({}, e, s)));
                });
              } catch (u) {
                log("Failed to add BlockOut ui", "error");
              }
            },
            buildBackdropDiv = function(e, t) {
              var n = dom(
                "div._pendo-guide-tt-region-block_._pendo-region-" + e + "_"
              );
              return (
                (n =
                  n.length > 0
                    ? n[0]
                    : dom(
                        '<div class="_pendo-guide-tt-region-block_ _pendo-region-' +
                          e +
                          '_"></div>'
                      )),
                dom(n).css(t),
                n
              );
            },
            checkPlacementChanged = function(e) {
              var t = _.isEqual(e, lastElementPos);
              return (lastElementPos = e), !t;
            },
            placeTooltip = function(e) {
              var t = getElementForGuideStep(e),
                n = getOffsetPosition(t);
              if ((addBlockOutUI(e), checkPlacementChanged(n))) {
                var i = e.attributes.height,
                  r = e.attributes.width,
                  o = e.attributes.layoutDir,
                  a = getTooltipDimensions(n, i, r, o),
                  s = dom(buildTooltipCSSSelector(e));
                s.css({
                  top: a.top,
                  left: a.left,
                  position: n.fixed ? "fixed" : ""
                }),
                  buildAndAppendArrow(s, a);
              }
            },
            getTooltipDimensions = function(e, t, n, i) {
              var r = pendo.TOOLTIP_ARROW_SIZE,
                o = { arrow: { border: {} }, content: { top: r, left: r } },
                a = pendo._get_screen_dim();
              return (
                (o.width = Math.min(n, a.width)),
                (o.height = t),
                (o.content.width = o.width - 2 * r),
                (o.content.height = o.height - 2 * r),
                i || (i = "auto"),
                (o = determineHorizontalBias(o, e, a, i)),
                (o = determineArrowPosition(o, e, a, i)),
                (o = buildArrowDimensions(o, e, a))
              );
            },
            determineHorizontalBias = function(e, t, n, i) {
              if ("right" == i || "left" == i)
                return (
                  pendo.log("Setting layout position to " + i),
                  (e.arrow.hbias = i),
                  e
                );
              var r = n.width / 3,
                o = [r, 2 * r];
              return (
                o[0] < t.left && t.left < o[1]
                  ? (e.arrow.hbias = "center")
                  : t.left < n.width / 2
                  ? (e.arrow.hbias = "left")
                  : (e.arrow.hbias = "right"),
                e
              );
            },
            determineArrowPosition = function(e, t, n, i) {
              if (
                (i && "DEFAULT" != i && "auto" != i && (e.arrowPosition = i),
                !e.arrowPosition)
              ) {
                var r = t.top - documentScrollTop(),
                  o = (r + t.height, t.left - documentScrollLeft()),
                  a = o + t.width;
                r < n.height / 3
                  ? (e.arrowPosition = "top")
                  : r > (2 * n.height) / 3 || "center" == e.arrow.hbias
                  ? (e.arrowPosition = "bottom")
                  : o < e.width && n.width - a < e.width
                  ? (e.arrowPosition = "top")
                  : (e.arrowPosition = e.arrow.hbias);
              }
              return e;
            },
            buildArrowDimensions = function(e, t, n) {
              var i = e.height,
                r = e.width;
              if (isBrowserInQuirksmode())
                return buildArrowDimensionsQM(e, t, n);
              if ("top" == e.arrowPosition || "bottom" == e.arrowPosition) {
                var o = 10,
                  a = 0;
                "top" == e.arrowPosition
                  ? ((e.top = t.top + t.height),
                    (e.arrow.top = isOldIE(9, 6) ? 6 : 2),
                    (a = -1))
                  : "bottom" == e.arrowPosition &&
                    ((e.top = t.top - i),
                    (e.arrow.top = i - pendo.TOOLTIP_ARROW_SIZE - 1),
                    (e.arrow.top += isOldIE(9, 6) ? 6 : 0),
                    (e.arrow.top += 8 == msie ? -1 : 0),
                    (a = 1));
                var s = o + pendo.TOOLTIP_ARROW_SIZE,
                  d = r - 3 * pendo.TOOLTIP_ARROW_SIZE - o;
                if (
                  ("left" == e.arrow.hbias
                    ? ((e.left =
                        t.left +
                        t.width / 2 -
                        (o + 2 * pendo.TOOLTIP_ARROW_SIZE)),
                      (e.arrow.left = s))
                    : "right" == e.arrow.hbias
                    ? ((e.left =
                        t.left -
                        r +
                        t.width / 2 +
                        (o + 2 * pendo.TOOLTIP_ARROW_SIZE)),
                      (e.arrow.left = d))
                    : ((e.left = t.left + t.width / 2 - r / 2),
                      (e.arrow.left = r / 2 - pendo.TOOLTIP_ARROW_SIZE)),
                  e.arrow.floating !== !1)
                ) {
                  var u = e.left + r - n.width;
                  (u -= Math.max(0, e.arrow.left + u - d)),
                    u > 0 && ((e.left -= u), (e.arrow.left += u));
                  var l = -e.left;
                  (l -= Math.max(0, s - (e.arrow.left - l))),
                    l > 0 && ((e.left += l), (e.arrow.left -= l));
                }
                return (
                  (e.arrow.border.top = e.arrow.top + a),
                  (e.arrow.border.left = e.arrow.left),
                  e
                );
              }
              return (
                "left" == e.arrow.hbias
                  ? ((e.left = t.left + t.width),
                    (e.arrow.left = 1),
                    (e.arrow.left += isOldIE(10, 6) ? 5 : 0),
                    (e.arrow.border.left = e.arrow.left - 1))
                  : "right" == e.arrow.hbias &&
                    ((e.left = Math.max(0, t.left - r)),
                    (e.arrow.left = r - pendo.TOOLTIP_ARROW_SIZE - 1),
                    (e.arrow.left += isOldIE(10, 6) ? 5 : 0),
                    (e.arrow.left += 7 == msie && trident >= 6 ? 1 : 0),
                    (e.arrow.border.left = e.arrow.left + 1)),
                (e.top = t.top - i / 2 + t.height / 2),
                (e.arrow.top = i / 2 - pendo.TOOLTIP_ARROW_SIZE),
                (e.arrow.border.top = e.arrow.top),
                e
              );
            };
          (pendo.LB_DEFAULT_WIDTH = 500), (pendo.LB_DEFAULT_HEIGHT = 500);
          var LIGHTBOX_CSS_NAME = "_pendo-guide-lb_",
            canLightboxStepBeShown = function(e) {
              return canStepBeRendered(e);
            },
            overlayDiv = null,
            addOverlay = function(e) {
              return (
                null === overlayDiv &&
                  (overlayDiv = dom("<div/>")
                    .addClass("_pendo-backdrop_")
                    .appendTo(getBody())),
                isBrowserInQuirksmode() &&
                  overlayDiv.css({
                    height: "100%",
                    width: "100%",
                    position: "absolute"
                  }),
                e && dom(overlayDiv).addClass("_pendo-onboarding_"),
                overlayDiv
              );
            },
            removeOverlay = function() {
              overlayDiv && (overlayDiv.remove(), (overlayDiv = null));
            },
            renderLightboxGuide = function(e) {
              var t = e.guideElement,
                n = pendo.TOOLTIP_ARROW_SIZE,
                i = e.attributes.height,
                r = e.attributes.width,
                o = Math.floor(r / 2),
                a = Math.floor(i / 2);
              t
                .addClass(LIGHTBOX_CSS_NAME)
                .css({
                  top: "50%",
                  left: "50%",
                  "margin-top": -a,
                  "margin-left": -o
                }),
                dom("._pendo-guide-container_", t).css({ bottom: n, right: n }),
                isBrowserInQuirksmode() && t.css({ position: "absolute" });
            },
            showLightboxGuide = function(e, t) {
              if (!canLightboxStepBeShown(e)) return null;
              t === undefined && (t = activeElements);
              e.element = getElementForGuideStep(e);
              renderLightboxGuide(e);
              var n = e.getGuide() ? e.getGuide().isOnboarding() : !1;
              addOverlay(n);
              var i = e.guideElement;
              t.push(i[0]), i.appendTo(getBody());
            },
            MOBILE_LIGHTBOX_CSS_NAME = "_pendo-guide-mobile-lb_",
            renderMobileLightboxGuide = function(e) {
              var t = e.guideElement;
              t.addClass(MOBILE_LIGHTBOX_CSS_NAME);
            },
            showMobileLightboxGuide = function(e, t) {
              function n(e) {
                e.preventDefault();
              }
              if (!canLightboxStepBeShown(e)) return null;
              t === undefined && (t = activeElements);
              e.element = getElementForGuideStep(e);
              renderMobileLightboxGuide(e);
              var i = addOverlay(),
                r = e.guideElement,
                o = pendo.TOOLTIP_ARROW_SIZE;
              r.css({ width: "", height: "" });
              var a = dom("._pendo-guide-container_", r).css({
                bottom: o,
                right: o
              });
              dom("._pendo-close-guide_", r)
                .remove()
                .prependTo(a),
                r.appendTo(getBody()),
                t.push(r[0]),
                attachEvent(i[0], "touchmove", n),
                attachEvent(r[0], "touchmove", n);
            },
            LAUNCHER_SEARCHING_CLASS = "_pendo-launcher-searching_",
            SEARCHBOX_CSS_NAME = "_pendo-launcher-search-box_",
            SEARCHBOX_CSS_SELECTOR = "." + SEARCHBOX_CSS_NAME + " input",
            LAUNCHER_DEFAULT_WIDTH = 330,
            LAUNCHER_DEFAULT_HEIGHT = 310,
            launcherBadge = null,
            launcherTooltipDiv = null,
            isPreventLauncher = !1,
            launcherHash = null,
            launcherActiveClass = "_pendo-launcher-active_",
            launcherElement = null,
            defaultLauncherTemplate = function() {
              return "";
            };
          (pendo.defaultLauncher = function(e, t) {
            defaultLauncherTemplate = t;
          }),
            (Launcher.create = function(e) {
              return _.reduce(
                Launcher.behaviors,
                function(e, t) {
                  return t.call(e);
                },
                e
              );
            }),
            (Launcher.behaviors = [
              Wrappable,
              Launcher,
              ContentValidation.Launcher,
              LauncherSearch,
              Onboarding,
              WhatsNewList
            ]);
          var removeLauncher = function() {
              launcherTooltipDiv &&
                (dom.removeNode(launcherTooltipDiv),
                (launcherTooltipDiv = null)),
                launcherElement &&
                  (launcherElement.dispose(), (launcherElement = null)),
                launcherBadge &&
                  (launcherBadge.dispose(), (launcherBadge = null));
            },
            showHideLauncher = function() {
              isLauncherOnElement() ||
              (!doesLauncherHaveGuides() && !launcherHasActiveSearch())
                ? hideLauncher()
                : showLauncher();
            },
            showLauncher = function() {
              launcherBadge && launcherBadge.show();
            },
            hideLauncher = function() {
              isLauncherOnElement() || collapseLauncherList(),
                launcherBadge && launcherBadge.hide();
            },
            isLauncher = function(e) {
              return e && _.isFunction(e.shouldBeAddedToLauncher)
                ? e.shouldBeAddedToLauncher()
                : e &&
                    e.launchMethod &&
                    e.launchMethod.indexOf("launcher") >= 0;
            },
            isLauncherOnElement = function() {
              return pendo.guideWidget &&
                pendo.guideWidget.data &&
                "element" === pendo.guideWidget.data.launchType
                ? !0
                : !1;
            },
            updateLauncher = function(e, t) {
              return pendo.guideWidget && _.isFunction(pendo.guideWidget.update)
                ? pendo.guideWidget.update(e, t)
                : void 0;
            },
            getLauncherContext = function(e) {
              var t = getMetadata();
              _.isObject(t) || (t = prepareOptions());
              var n = _.extend(
                {
                  hidePoweredBy: !1,
                  guides: [],
                  guide: {},
                  step: {},
                  metadata: escapeStringsInObject(t)
                },
                pendo.guideWidget
              );
              return (n.data = _.extend({}, n.data)), e && (n.guides = e), n;
            },
            buildLauncherItem = function(e) {
              var t = document.createElement("div");
              dom(t).addClass("_pendo-launcher-item_"),
                dom(t).attr("id", "launcher-" + e.id);
              var n = document.createElement("a");
              return (
                (n.href = "#"), (n.innerHTML = e.name), t.appendChild(n), t
              );
            },
            addGuideToLauncher = _.compose(
              showHideLauncher,
              function(e, t) {
                if (isLauncher(e)) {
                  var n = Sizzle(
                    "._pendo-launcher_ ._pendo-launcher-guide-listing_"
                  )[0];
                  if (n) {
                    var i,
                      r = Sizzle("#launcher-" + e.id);
                    if (
                      ((i = r.length ? r[0] : buildLauncherItem(e)),
                      (r = r.length > 0),
                      _.isNumber(t))
                    ) {
                      var o = Sizzle("._pendo-launcher-item_");
                      o[t]
                        ? i.id != o[t].id && n.insertBefore(i, o[t])
                        : n.appendChild(i);
                    } else n.appendChild(i);
                  }
                }
              }
            ),
            preventLauncher = function() {
              removeLauncher();
            },
            isLauncherAvailable = function() {
              return !!launcherTooltipDiv && !isPreventLauncher;
            },
            isLauncherVisible = function() {
              var e = dom(launcherTooltipDiv);
              return e.hasClass(launcherActiveClass);
            },
            doesLauncherHaveGuides = function() {
              return Sizzle("._pendo-launcher-item_").length > 0;
            },
            collapseLauncherList = function() {
              var e = dom(launcherTooltipDiv);
              e.hasClass(launcherActiveClass) &&
                (e.removeClass(launcherActiveClass),
                launcherBadge && launcherBadge.setActive(!1));
            },
            expandLauncherList = function() {
              var e = dom(launcherTooltipDiv);
              e.hasClass(launcherActiveClass) ||
                (e.addClass(launcherActiveClass),
                launcherBadge && launcherBadge.setActive(!0));
            },
            toggleLauncher = function() {
              isLauncherAvailable() &&
                (isLauncherVisible()
                  ? collapseLauncherList()
                  : expandLauncherList());
            },
            initLauncher = function() {
              try {
                var e = pendo.guideWidget || {},
                  t = e.data || {},
                  n = t.device || { desktop: !0, mobile: !1, iframe: !1 };
                if ((removeLauncher(), !isMobileUserAgent() && !n.desktop))
                  return;
                if (isMobileUserAgent() && !n.mobile) return;
                if (detectMaster() && !n.iframe) return;
                e.enabled &&
                  (createLauncher(t),
                  hideLauncher(),
                  shouldSwitchToOBM() && startOBM());
              } catch (i) {
                writeException(i, "ERROR while initializing launcher");
              }
            };
          !(function() {
            function e(e) {
              function n(e) {
                return (
                  t[(e >> 18) & 63] +
                  t[(e >> 12) & 63] +
                  t[(e >> 6) & 63] +
                  t[63 & e]
                );
              }
              var i,
                r,
                o,
                a = e.length % 3,
                s = "";
              for (i = 0, o = e.length - a; o > i; i += 3)
                (r = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2]), (s += n(r));
              switch (a) {
                case 1:
                  (r = e[e.length - 1]),
                    (s += t[r >> 2]),
                    (s += t[(r << 4) & 63]);
                  break;
                case 2:
                  (r = (e[e.length - 2] << 8) + e[e.length - 1]),
                    (s += t[r >> 10]),
                    (s += t[(r >> 4) & 63]),
                    (s += t[(r << 2) & 63]);
              }
              return s;
            }
            var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(
              ""
            );
            pendo._.extend(pendo, { fromByteArray: e });
          })(),
            function() {
              function e(e, t) {
                var n = e.split("."),
                  i = h;
                !(n[0] in i) && i.execScript && i.execScript("var " + n[0]);
                for (var r; n.length && (r = n.shift()); )
                  n.length || t === p
                    ? (i = i[r] ? i[r] : (i[r] = {}))
                    : (i[r] = t);
              }
              function t(e, t) {
                if (
                  ((this.index = "number" == typeof t ? t : 0),
                  (this.e = 0),
                  (this.buffer =
                    e instanceof (g ? Uint8Array : Array)
                      ? e
                      : new (g ? Uint8Array : Array)(32768)),
                  2 * this.buffer.length <= this.index)
                )
                  throw Error("invalid index");
                this.buffer.length <= this.index && n(this);
              }
              function n(e) {
                var t,
                  n = e.buffer,
                  i = n.length,
                  r = new (g ? Uint8Array : Array)(i << 1);
                if (g) r.set(n);
                else for (t = 0; i > t; ++t) r[t] = n[t];
                return (e.buffer = r);
              }
              function i(e) {
                (this.buffer = new (g ? Uint16Array : Array)(2 * e)),
                  (this.length = 0);
              }
              function r(e, t) {
                (this.d = S),
                  (this.i = 0),
                  (this.input =
                    g && e instanceof Array ? new Uint8Array(e) : e),
                  (this.c = 0),
                  t &&
                    (t.lazy && (this.i = t.lazy),
                    "number" == typeof t.compressionType &&
                      (this.d = t.compressionType),
                    t.outputBuffer &&
                      (this.a =
                        g && t.outputBuffer instanceof Array
                          ? new Uint8Array(t.outputBuffer)
                          : t.outputBuffer),
                    "number" == typeof t.outputIndex &&
                      (this.c = t.outputIndex)),
                  this.a || (this.a = new (g ? Uint8Array : Array)(32768));
              }
              function o(e, t) {
                (this.length = e), (this.k = t);
              }
              function a(e, t) {
                function n(e, t) {
                  var n,
                    i = e.k,
                    r = [],
                    o = 0;
                  (n = x[e.length]),
                    (r[o++] = 65535 & n),
                    (r[o++] = (n >> 16) & 255),
                    (r[o++] = n >> 24);
                  var a;
                  switch (f) {
                    case 1 === i:
                      a = [0, i - 1, 0];
                      break;
                    case 2 === i:
                      a = [1, i - 2, 0];
                      break;
                    case 3 === i:
                      a = [2, i - 3, 0];
                      break;
                    case 4 === i:
                      a = [3, i - 4, 0];
                      break;
                    case 6 >= i:
                      a = [4, i - 5, 1];
                      break;
                    case 8 >= i:
                      a = [5, i - 7, 1];
                      break;
                    case 12 >= i:
                      a = [6, i - 9, 2];
                      break;
                    case 16 >= i:
                      a = [7, i - 13, 2];
                      break;
                    case 24 >= i:
                      a = [8, i - 17, 3];
                      break;
                    case 32 >= i:
                      a = [9, i - 25, 3];
                      break;
                    case 48 >= i:
                      a = [10, i - 33, 4];
                      break;
                    case 64 >= i:
                      a = [11, i - 49, 4];
                      break;
                    case 96 >= i:
                      a = [12, i - 65, 5];
                      break;
                    case 128 >= i:
                      a = [13, i - 97, 5];
                      break;
                    case 192 >= i:
                      a = [14, i - 129, 6];
                      break;
                    case 256 >= i:
                      a = [15, i - 193, 6];
                      break;
                    case 384 >= i:
                      a = [16, i - 257, 7];
                      break;
                    case 512 >= i:
                      a = [17, i - 385, 7];
                      break;
                    case 768 >= i:
                      a = [18, i - 513, 8];
                      break;
                    case 1024 >= i:
                      a = [19, i - 769, 8];
                      break;
                    case 1536 >= i:
                      a = [20, i - 1025, 9];
                      break;
                    case 2048 >= i:
                      a = [21, i - 1537, 9];
                      break;
                    case 3072 >= i:
                      a = [22, i - 2049, 10];
                      break;
                    case 4096 >= i:
                      a = [23, i - 3073, 10];
                      break;
                    case 6144 >= i:
                      a = [24, i - 4097, 11];
                      break;
                    case 8192 >= i:
                      a = [25, i - 6145, 11];
                      break;
                    case 12288 >= i:
                      a = [26, i - 8193, 12];
                      break;
                    case 16384 >= i:
                      a = [27, i - 12289, 12];
                      break;
                    case 24576 >= i:
                      a = [28, i - 16385, 13];
                      break;
                    case 32768 >= i:
                      a = [29, i - 24577, 13];
                      break;
                    default:
                      throw "invalid distance";
                  }
                  (n = a), (r[o++] = n[0]), (r[o++] = n[1]), (r[o++] = n[2]);
                  var s, d;
                  for (s = 0, d = r.length; d > s; ++s) m[_++] = r[s];
                  b[r[0]]++, w[r[3]]++, (y = e.length + t - 1), (c = null);
                }
                var i,
                  r,
                  o,
                  a,
                  d,
                  u,
                  l,
                  c,
                  h,
                  v = {},
                  m = g ? new Uint16Array(2 * t.length) : [],
                  _ = 0,
                  y = 0,
                  b = new (g ? Uint32Array : Array)(286),
                  w = new (g ? Uint32Array : Array)(30),
                  E = e.i;
                if (!g) {
                  for (o = 0; 285 >= o; ) b[o++] = 0;
                  for (o = 0; 29 >= o; ) w[o++] = 0;
                }
                for (b[256] = 1, i = 0, r = t.length; r > i; ++i) {
                  for (o = d = 0, a = 3; a > o && i + o !== r; ++o)
                    d = (d << 8) | t[i + o];
                  if ((v[d] === p && (v[d] = []), (u = v[d]), !(0 < y--))) {
                    for (; 0 < u.length && 32768 < i - u[0]; ) u.shift();
                    if (i + 3 >= r) {
                      for (c && n(c, -1), o = 0, a = r - i; a > o; ++o)
                        (h = t[i + o]), (m[_++] = h), ++b[h];
                      break;
                    }
                    0 < u.length
                      ? ((l = s(t, i, u)),
                        c
                          ? c.length < l.length
                            ? ((h = t[i - 1]), (m[_++] = h), ++b[h], n(l, 0))
                            : n(c, -1)
                          : l.length < E
                          ? (c = l)
                          : n(l, 0))
                      : c
                      ? n(c, -1)
                      : ((h = t[i]), (m[_++] = h), ++b[h]);
                  }
                  u.push(i);
                }
                return (
                  (m[_++] = 256),
                  b[256]++,
                  (e.m = b),
                  (e.l = w),
                  g ? m.subarray(0, _) : m
                );
              }
              function s(e, t, n) {
                var i,
                  r,
                  a,
                  s,
                  d,
                  u,
                  l = 0,
                  c = e.length;
                (s = 0), (u = n.length);
                e: for (; u > s; s++) {
                  if (((i = n[u - s - 1]), (a = 3), l > 3)) {
                    for (d = l; d > 3; d--)
                      if (e[i + d - 1] !== e[t + d - 1]) continue e;
                    a = l;
                  }
                  for (; 258 > a && c > t + a && e[i + a] === e[t + a]; ) ++a;
                  if ((a > l && ((r = i), (l = a)), 258 === a)) break;
                }
                return new o(l, t - r);
              }
              function d(e, t) {
                var n,
                  r,
                  o,
                  a,
                  s,
                  d = e.length,
                  l = new i(572),
                  c = new (g ? Uint8Array : Array)(d);
                if (!g) for (a = 0; d > a; a++) c[a] = 0;
                for (a = 0; d > a; ++a) 0 < e[a] && l.push(a, e[a]);
                if (
                  ((n = Array(l.length / 2)),
                  (r = new (g ? Uint32Array : Array)(l.length / 2)),
                  1 === n.length)
                )
                  return (c[l.pop().index] = 1), c;
                for (a = 0, s = l.length / 2; s > a; ++a)
                  (n[a] = l.pop()), (r[a] = n[a].value);
                for (o = u(r, r.length, t), a = 0, s = n.length; s > a; ++a)
                  c[n[a].index] = o[a];
                return c;
              }
              function u(e, t, n) {
                function i(e) {
                  var n = f[e][h[e]];
                  n === t ? (i(e + 1), i(e + 1)) : --c[n], ++h[e];
                }
                var r,
                  o,
                  a,
                  s,
                  d,
                  u = new (g ? Uint16Array : Array)(n),
                  l = new (g ? Uint8Array : Array)(n),
                  c = new (g ? Uint8Array : Array)(t),
                  p = Array(n),
                  f = Array(n),
                  h = Array(n),
                  v = (1 << n) - t,
                  m = 1 << (n - 1);
                for (u[n - 1] = t, o = 0; n > o; ++o)
                  m > v ? (l[o] = 0) : ((l[o] = 1), (v -= m)),
                    (v <<= 1),
                    (u[n - 2 - o] = ((u[n - 1 - o] / 2) | 0) + t);
                for (
                  u[0] = l[0], p[0] = Array(u[0]), f[0] = Array(u[0]), o = 1;
                  n > o;
                  ++o
                )
                  u[o] > 2 * u[o - 1] + l[o] && (u[o] = 2 * u[o - 1] + l[o]),
                    (p[o] = Array(u[o])),
                    (f[o] = Array(u[o]));
                for (r = 0; t > r; ++r) c[r] = n;
                for (a = 0; a < u[n - 1]; ++a)
                  (p[n - 1][a] = e[a]), (f[n - 1][a] = a);
                for (r = 0; n > r; ++r) h[r] = 0;
                for (
                  1 === l[n - 1] && (--c[0], ++h[n - 1]), o = n - 2;
                  o >= 0;
                  --o
                ) {
                  for (s = r = 0, d = h[o + 1], a = 0; a < u[o]; a++)
                    (s = p[o + 1][d] + p[o + 1][d + 1]),
                      s > e[r]
                        ? ((p[o][a] = s), (f[o][a] = t), (d += 2))
                        : ((p[o][a] = e[r]), (f[o][a] = r), ++r);
                  (h[o] = 0), 1 === l[o] && i(o);
                }
                return c;
              }
              function l(e) {
                var t,
                  n,
                  i,
                  r,
                  o = new (g ? Uint16Array : Array)(e.length),
                  a = [],
                  s = [],
                  d = 0;
                for (t = 0, n = e.length; n > t; t++)
                  a[e[t]] = (0 | a[e[t]]) + 1;
                for (t = 1, n = 16; n >= t; t++)
                  (s[t] = d), (d += 0 | a[t]), (d <<= 1);
                for (t = 0, n = e.length; n > t; t++)
                  for (
                    d = s[e[t]], s[e[t]] += 1, i = o[t] = 0, r = e[t];
                    r > i;
                    i++
                  )
                    (o[t] = (o[t] << 1) | (1 & d)), (d >>>= 1);
                return o;
              }
              function c(e, t) {
                (this.input = e),
                  (this.a = new (g ? Uint8Array : Array)(32768)),
                  (this.d = I.g);
                var n,
                  i = {};
                (!t && (t = {})) ||
                  "number" != typeof t.compressionType ||
                  (this.d = t.compressionType);
                for (n in t) i[n] = t[n];
                (i.outputBuffer = this.a), (this.j = new r(this.input, i));
              }
              var p = void 0,
                f = !0,
                h = this,
                g =
                  "undefined" != typeof Uint8Array &&
                  "undefined" != typeof Uint16Array &&
                  "undefined" != typeof Uint32Array;
              (t.prototype.b = function(e, t, i) {
                var r,
                  o = this.buffer,
                  a = this.index,
                  s = this.e,
                  d = o[a];
                if (
                  (i &&
                    t > 1 &&
                    (e =
                      t > 8
                        ? ((w[255 & e] << 24) |
                            (w[(e >>> 8) & 255] << 16) |
                            (w[(e >>> 16) & 255] << 8) |
                            w[(e >>> 24) & 255]) >>
                          (32 - t)
                        : w[e] >> (8 - t)),
                  8 > t + s)
                )
                  (d = (d << t) | e), (s += t);
                else
                  for (r = 0; t > r; ++r)
                    (d = (d << 1) | ((e >> (t - r - 1)) & 1)),
                      8 === ++s &&
                        ((s = 0),
                        (o[a++] = w[d]),
                        (d = 0),
                        a === o.length && (o = n(this)));
                (o[a] = d), (this.buffer = o), (this.e = s), (this.index = a);
              }),
                (t.prototype.finish = function() {
                  var e,
                    t = this.buffer,
                    n = this.index;
                  return (
                    0 < this.e &&
                      ((t[n] <<= 8 - this.e), (t[n] = w[t[n]]), n++),
                    g ? (e = t.subarray(0, n)) : ((t.length = n), (e = t)),
                    e
                  );
                });
              var v,
                m = new (g ? Uint8Array : Array)(256);
              for (v = 0; 256 > v; ++v) {
                for (var _ = v, y = _, b = 7, _ = _ >>> 1; _; _ >>>= 1)
                  (y <<= 1), (y |= 1 & _), --b;
                m[v] = ((y << b) & 255) >>> 0;
              }
              var w = m;
              (i.prototype.getParent = function(e) {
                return 2 * (((e - 2) / 4) | 0);
              }),
                (i.prototype.push = function(e, t) {
                  var n,
                    i,
                    r,
                    o = this.buffer;
                  for (
                    n = this.length, o[this.length++] = t, o[this.length++] = e;
                    n > 0 && ((i = this.getParent(n)), o[n] > o[i]);

                  )
                    (r = o[n]),
                      (o[n] = o[i]),
                      (o[i] = r),
                      (r = o[n + 1]),
                      (o[n + 1] = o[i + 1]),
                      (o[i + 1] = r),
                      (n = i);
                  return this.length;
                }),
                (i.prototype.pop = function() {
                  var e,
                    t,
                    n,
                    i,
                    r,
                    o = this.buffer;
                  for (
                    t = o[0],
                      e = o[1],
                      this.length -= 2,
                      o[0] = o[this.length],
                      o[1] = o[this.length + 1],
                      r = 0;
                    ((i = 2 * r + 2), !(i >= this.length)) &&
                    (i + 2 < this.length && o[i + 2] > o[i] && (i += 2),
                    o[i] > o[r]);

                  )
                    (n = o[r]),
                      (o[r] = o[i]),
                      (o[i] = n),
                      (n = o[r + 1]),
                      (o[r + 1] = o[i + 1]),
                      (o[i + 1] = n),
                      (r = i);
                  return { index: e, value: t, length: this.length };
                });
              var E,
                S = 2,
                C = { NONE: 0, h: 1, g: S, n: 3 },
                T = [];
              for (E = 0; 288 > E; E++)
                switch (f) {
                  case 143 >= E:
                    T.push([E + 48, 8]);
                    break;
                  case 255 >= E:
                    T.push([E - 144 + 400, 9]);
                    break;
                  case 279 >= E:
                    T.push([E - 256 + 0, 7]);
                    break;
                  case 287 >= E:
                    T.push([E - 280 + 192, 8]);
                    break;
                  default:
                    throw "invalid literal: " + E;
                }
              r.prototype.f = function() {
                var e,
                  n,
                  i,
                  r,
                  o = this.input;
                switch (this.d) {
                  case 0:
                    for (i = 0, r = o.length; r > i; ) {
                      (n = g
                        ? o.subarray(i, i + 65535)
                        : o.slice(i, i + 65535)),
                        (i += n.length);
                      var s = n,
                        u = i === r,
                        c = p,
                        h = p,
                        v = p,
                        m = p,
                        _ = p,
                        y = this.a,
                        b = this.c;
                      if (g) {
                        for (
                          y = new Uint8Array(this.a.buffer);
                          y.length <= b + s.length + 5;

                        )
                          y = new Uint8Array(y.length << 1);
                        y.set(this.a);
                      }
                      if (
                        ((c = u ? 1 : 0),
                        (y[b++] = 0 | c),
                        (h = s.length),
                        (v = (~h + 65536) & 65535),
                        (y[b++] = 255 & h),
                        (y[b++] = (h >>> 8) & 255),
                        (y[b++] = 255 & v),
                        (y[b++] = (v >>> 8) & 255),
                        g)
                      )
                        y.set(s, b), (b += s.length), (y = y.subarray(0, b));
                      else {
                        for (m = 0, _ = s.length; _ > m; ++m) y[b++] = s[m];
                        y.length = b;
                      }
                      (this.c = b), (this.a = y);
                    }
                    break;
                  case 1:
                    var w = new t(
                      g ? new Uint8Array(this.a.buffer) : this.a,
                      this.c
                    );
                    w.b(1, 1, f), w.b(1, 2, f);
                    var E,
                      C,
                      A,
                      x = a(this, o);
                    for (E = 0, C = x.length; C > E; E++)
                      if (((A = x[E]), t.prototype.b.apply(w, T[A]), A > 256))
                        w.b(x[++E], x[++E], f),
                          w.b(x[++E], 5),
                          w.b(x[++E], x[++E], f);
                      else if (256 === A) break;
                    (this.a = w.finish()), (this.c = this.a.length);
                    break;
                  case S:
                    var I,
                      O,
                      L,
                      G,
                      B,
                      N,
                      k,
                      D,
                      P,
                      R,
                      M,
                      F,
                      U,
                      H,
                      z,
                      W = new t(
                        g ? new Uint8Array(this.a.buffer) : this.a,
                        this.c
                      ),
                      j = [
                        16,
                        17,
                        18,
                        0,
                        8,
                        7,
                        9,
                        6,
                        10,
                        5,
                        11,
                        4,
                        12,
                        3,
                        13,
                        2,
                        14,
                        1,
                        15
                      ],
                      V = Array(19);
                    for (
                      I = S,
                        W.b(1, 1, f),
                        W.b(I, 2, f),
                        O = a(this, o),
                        N = d(this.m, 15),
                        k = l(N),
                        D = d(this.l, 7),
                        P = l(D),
                        L = 286;
                      L > 257 && 0 === N[L - 1];
                      L--
                    );
                    for (G = 30; G > 1 && 0 === D[G - 1]; G--);
                    var q,
                      J,
                      X,
                      K,
                      Z,
                      $,
                      Y = L,
                      Q = G,
                      ee = new (g ? Uint32Array : Array)(Y + Q),
                      te = new (g ? Uint32Array : Array)(316),
                      ne = new (g ? Uint8Array : Array)(19);
                    for (q = J = 0; Y > q; q++) ee[J++] = N[q];
                    for (q = 0; Q > q; q++) ee[J++] = D[q];
                    if (!g) for (q = 0, K = ne.length; K > q; ++q) ne[q] = 0;
                    for (q = Z = 0, K = ee.length; K > q; q += J) {
                      for (J = 1; K > q + J && ee[q + J] === ee[q]; ++J);
                      if (((X = J), 0 === ee[q]))
                        if (3 > X) for (; 0 < X--; ) (te[Z++] = 0), ne[0]++;
                        else
                          for (; X > 0; )
                            ($ = 138 > X ? X : 138),
                              $ > X - 3 && X > $ && ($ = X - 3),
                              10 >= $
                                ? ((te[Z++] = 17), (te[Z++] = $ - 3), ne[17]++)
                                : ((te[Z++] = 18),
                                  (te[Z++] = $ - 11),
                                  ne[18]++),
                              (X -= $);
                      else if (((te[Z++] = ee[q]), ne[ee[q]]++, X--, 3 > X))
                        for (; 0 < X--; ) (te[Z++] = ee[q]), ne[ee[q]]++;
                      else
                        for (; X > 0; )
                          ($ = 6 > X ? X : 6),
                            $ > X - 3 && X > $ && ($ = X - 3),
                            (te[Z++] = 16),
                            (te[Z++] = $ - 3),
                            ne[16]++,
                            (X -= $);
                    }
                    for (
                      e = g ? te.subarray(0, Z) : te.slice(0, Z),
                        R = d(ne, 7),
                        H = 0;
                      19 > H;
                      H++
                    )
                      V[H] = R[j[H]];
                    for (B = 19; B > 4 && 0 === V[B - 1]; B--);
                    for (
                      M = l(R),
                        W.b(L - 257, 5, f),
                        W.b(G - 1, 5, f),
                        W.b(B - 4, 4, f),
                        H = 0;
                      B > H;
                      H++
                    )
                      W.b(V[H], 3, f);
                    for (H = 0, z = e.length; z > H; H++)
                      if (((F = e[H]), W.b(M[F], R[F], f), F >= 16)) {
                        switch ((H++, F)) {
                          case 16:
                            U = 2;
                            break;
                          case 17:
                            U = 3;
                            break;
                          case 18:
                            U = 7;
                            break;
                          default:
                            throw "invalid code: " + F;
                        }
                        W.b(e[H], U, f);
                      }
                    var ie,
                      re,
                      oe,
                      ae,
                      se,
                      de,
                      ue,
                      le,
                      ce = [k, N],
                      pe = [P, D];
                    for (
                      se = ce[0],
                        de = ce[1],
                        ue = pe[0],
                        le = pe[1],
                        ie = 0,
                        re = O.length;
                      re > ie;
                      ++ie
                    )
                      if (((oe = O[ie]), W.b(se[oe], de[oe], f), oe > 256))
                        W.b(O[++ie], O[++ie], f),
                          (ae = O[++ie]),
                          W.b(ue[ae], le[ae], f),
                          W.b(O[++ie], O[++ie], f);
                      else if (256 === oe) break;
                    (this.a = W.finish()), (this.c = this.a.length);
                    break;
                  default:
                    throw "invalid compression type";
                }
                return this.a;
              };
              var A = (function() {
                  function e(e) {
                    switch (f) {
                      case 3 === e:
                        return [257, e - 3, 0];
                      case 4 === e:
                        return [258, e - 4, 0];
                      case 5 === e:
                        return [259, e - 5, 0];
                      case 6 === e:
                        return [260, e - 6, 0];
                      case 7 === e:
                        return [261, e - 7, 0];
                      case 8 === e:
                        return [262, e - 8, 0];
                      case 9 === e:
                        return [263, e - 9, 0];
                      case 10 === e:
                        return [264, e - 10, 0];
                      case 12 >= e:
                        return [265, e - 11, 1];
                      case 14 >= e:
                        return [266, e - 13, 1];
                      case 16 >= e:
                        return [267, e - 15, 1];
                      case 18 >= e:
                        return [268, e - 17, 1];
                      case 22 >= e:
                        return [269, e - 19, 2];
                      case 26 >= e:
                        return [270, e - 23, 2];
                      case 30 >= e:
                        return [271, e - 27, 2];
                      case 34 >= e:
                        return [272, e - 31, 2];
                      case 42 >= e:
                        return [273, e - 35, 3];
                      case 50 >= e:
                        return [274, e - 43, 3];
                      case 58 >= e:
                        return [275, e - 51, 3];
                      case 66 >= e:
                        return [276, e - 59, 3];
                      case 82 >= e:
                        return [277, e - 67, 4];
                      case 98 >= e:
                        return [278, e - 83, 4];
                      case 114 >= e:
                        return [279, e - 99, 4];
                      case 130 >= e:
                        return [280, e - 115, 4];
                      case 162 >= e:
                        return [281, e - 131, 5];
                      case 194 >= e:
                        return [282, e - 163, 5];
                      case 226 >= e:
                        return [283, e - 195, 5];
                      case 257 >= e:
                        return [284, e - 227, 5];
                      case 258 === e:
                        return [285, e - 258, 0];
                      default:
                        throw "invalid length: " + e;
                    }
                  }
                  var t,
                    n,
                    i = [];
                  for (t = 3; 258 >= t; t++)
                    (n = e(t)), (i[t] = (n[2] << 24) | (n[1] << 16) | n[0]);
                  return i;
                })(),
                x = g ? new Uint32Array(A) : A,
                I = C;
              (c.prototype.f = function() {
                var e,
                  t,
                  n,
                  i,
                  r,
                  o,
                  a = 0;
                switch (
                  ((o = this.a),
                  (e = Math.LOG2E * Math.log(32768) - 8),
                  (t = (e << 4) | 8),
                  (o[a++] = t),
                  this.d)
                ) {
                  case I.NONE:
                    i = 0;
                    break;
                  case I.h:
                    i = 1;
                    break;
                  case I.g:
                    i = 2;
                    break;
                  default:
                    throw Error("unsupported compression type");
                }
                (n = (i << 6) | 0), (o[a++] = n | (31 - ((256 * t + n) % 31)));
                var s = this.input;
                if ("string" == typeof s) {
                  var d,
                    u,
                    l = s.split("");
                  for (d = 0, u = l.length; u > d; d++)
                    l[d] = (255 & l[d].charCodeAt(0)) >>> 0;
                  s = l;
                }
                for (var c, p = 1, f = 0, h = s.length, v = 0; h > 0; ) {
                  (c = h > 1024 ? 1024 : h), (h -= c);
                  do (p += s[v++]), (f += p);
                  while (--c);
                  (p %= 65521), (f %= 65521);
                }
                return (
                  (r = ((f << 16) | p) >>> 0),
                  (this.j.c = a),
                  (o = this.j.f()),
                  (a = o.length),
                  g &&
                    ((o = new Uint8Array(o.buffer)),
                    o.length <= a + 4 &&
                      ((this.a = new Uint8Array(o.length + 4)),
                      this.a.set(o),
                      (o = this.a)),
                    (o = o.subarray(0, a + 4))),
                  (o[a++] = (r >> 24) & 255),
                  (o[a++] = (r >> 16) & 255),
                  (o[a++] = (r >> 8) & 255),
                  (o[a++] = 255 & r),
                  o
                );
              }),
                e("Zlib.Deflate", c),
                e("Zlib.Deflate.compress", function(e, t) {
                  return new c(e, t).f();
                }),
                e("Zlib.Deflate.prototype.compress", c.prototype.f);
              var O,
                L,
                G,
                B,
                N = { NONE: I.NONE, FIXED: I.h, DYNAMIC: I.g };
              if (Object.keys) O = Object.keys(N);
              else for (L in ((O = []), (G = 0), N)) O[G++] = L;
              for (G = 0, B = O.length; B > G; ++G)
                (L = O[G]), e("Zlib.Deflate.CompressionType." + L, N[L]);
            }.call(pendo),
            function() {
              function e(e, n) {
                var i = e.split("."),
                  r = t;
                !(i[0] in r) && r.execScript && r.execScript("var " + i[0]);
                for (var o; i.length && (o = i.shift()); )
                  i.length || void 0 === n
                    ? (r = r[o] ? r[o] : (r[o] = {}))
                    : (r[o] = n);
              }
              var t = this,
                n = {
                  c: function(e, t, i) {
                    return n.update(e, 0, t, i);
                  },
                  update: function(e, t, i, r) {
                    var o = n.a,
                      a = "number" == typeof i ? i : (i = 0),
                      s = "number" == typeof r ? r : e.length;
                    for (t ^= 4294967295, a = 7 & s; a--; ++i)
                      t = (t >>> 8) ^ o[255 & (t ^ e[i])];
                    for (a = s >> 3; a--; i += 8)
                      (t = (t >>> 8) ^ o[255 & (t ^ e[i])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 1])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 2])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 3])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 4])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 5])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 6])]),
                        (t = (t >>> 8) ^ o[255 & (t ^ e[i + 7])]);
                    return (4294967295 ^ t) >>> 0;
                  },
                  d: function(e, t) {
                    return (n.a[255 & (e ^ t)] ^ (e >>> 8)) >>> 0;
                  },
                  b: [
                    0,
                    1996959894,
                    3993919788,
                    2567524794,
                    124634137,
                    1886057615,
                    3915621685,
                    2657392035,
                    249268274,
                    2044508324,
                    3772115230,
                    2547177864,
                    162941995,
                    2125561021,
                    3887607047,
                    2428444049,
                    498536548,
                    1789927666,
                    4089016648,
                    2227061214,
                    450548861,
                    1843258603,
                    4107580753,
                    2211677639,
                    325883990,
                    1684777152,
                    4251122042,
                    2321926636,
                    335633487,
                    1661365465,
                    4195302755,
                    2366115317,
                    997073096,
                    1281953886,
                    3579855332,
                    2724688242,
                    1006888145,
                    1258607687,
                    3524101629,
                    2768942443,
                    901097722,
                    1119000684,
                    3686517206,
                    2898065728,
                    853044451,
                    1172266101,
                    3705015759,
                    2882616665,
                    651767980,
                    1373503546,
                    3369554304,
                    3218104598,
                    565507253,
                    1454621731,
                    3485111705,
                    3099436303,
                    671266974,
                    1594198024,
                    3322730930,
                    2970347812,
                    795835527,
                    1483230225,
                    3244367275,
                    3060149565,
                    1994146192,
                    31158534,
                    2563907772,
                    4023717930,
                    1907459465,
                    112637215,
                    2680153253,
                    3904427059,
                    2013776290,
                    251722036,
                    2517215374,
                    3775830040,
                    2137656763,
                    141376813,
                    2439277719,
                    3865271297,
                    1802195444,
                    476864866,
                    2238001368,
                    4066508878,
                    1812370925,
                    453092731,
                    2181625025,
                    4111451223,
                    1706088902,
                    314042704,
                    2344532202,
                    4240017532,
                    1658658271,
                    366619977,
                    2362670323,
                    4224994405,
                    1303535960,
                    984961486,
                    2747007092,
                    3569037538,
                    1256170817,
                    1037604311,
                    2765210733,
                    3554079995,
                    1131014506,
                    879679996,
                    2909243462,
                    3663771856,
                    1141124467,
                    855842277,
                    2852801631,
                    3708648649,
                    1342533948,
                    654459306,
                    3188396048,
                    3373015174,
                    1466479909,
                    544179635,
                    3110523913,
                    3462522015,
                    1591671054,
                    702138776,
                    2966460450,
                    3352799412,
                    1504918807,
                    783551873,
                    3082640443,
                    3233442989,
                    3988292384,
                    2596254646,
                    62317068,
                    1957810842,
                    3939845945,
                    2647816111,
                    81470997,
                    1943803523,
                    3814918930,
                    2489596804,
                    225274430,
                    2053790376,
                    3826175755,
                    2466906013,
                    167816743,
                    2097651377,
                    4027552580,
                    2265490386,
                    503444072,
                    1762050814,
                    4150417245,
                    2154129355,
                    426522225,
                    1852507879,
                    4275313526,
                    2312317920,
                    282753626,
                    1742555852,
                    4189708143,
                    2394877945,
                    397917763,
                    1622183637,
                    3604390888,
                    2714866558,
                    953729732,
                    1340076626,
                    3518719985,
                    2797360999,
                    1068828381,
                    1219638859,
                    3624741850,
                    2936675148,
                    906185462,
                    1090812512,
                    3747672003,
                    2825379669,
                    829329135,
                    1181335161,
                    3412177804,
                    3160834842,
                    628085408,
                    1382605366,
                    3423369109,
                    3138078467,
                    570562233,
                    1426400815,
                    3317316542,
                    2998733608,
                    733239954,
                    1555261956,
                    3268935591,
                    3050360625,
                    752459403,
                    1541320221,
                    2607071920,
                    3965973030,
                    1969922972,
                    40735498,
                    2617837225,
                    3943577151,
                    1913087877,
                    83908371,
                    2512341634,
                    3803740692,
                    2075208622,
                    213261112,
                    2463272603,
                    3855990285,
                    2094854071,
                    198958881,
                    2262029012,
                    4057260610,
                    1759359992,
                    534414190,
                    2176718541,
                    4139329115,
                    1873836001,
                    414664567,
                    2282248934,
                    4279200368,
                    1711684554,
                    285281116,
                    2405801727,
                    4167216745,
                    1634467795,
                    376229701,
                    2685067896,
                    3608007406,
                    1308918612,
                    956543938,
                    2808555105,
                    3495958263,
                    1231636301,
                    1047427035,
                    2932959818,
                    3654703836,
                    1088359270,
                    936918e3,
                    2847714899,
                    3736837829,
                    1202900863,
                    817233897,
                    3183342108,
                    3401237130,
                    1404277552,
                    615818150,
                    3134207493,
                    3453421203,
                    1423857449,
                    601450431,
                    3009837614,
                    3294710456,
                    1567103746,
                    711928724,
                    3020668471,
                    3272380065,
                    1510334235,
                    755167117
                  ]
                };
              (n.a =
                "undefined" != typeof Uint8Array &&
                "undefined" != typeof Uint16Array &&
                "undefined" != typeof Uint32Array
                  ? new Uint32Array(n.b)
                  : n.b),
                e("Zlib.CRC32", n),
                e("Zlib.CRC32.calc", n.c),
                e("Zlib.CRC32.update", n.update);
            }.call(pendo);
          var JSON = window.JSON;
          JSON || (JSON = {}),
            (function() {
              function f(e) {
                return 10 > e ? "0" + e : e;
              }
              function quote(e) {
                return (
                  (escapable.lastIndex = 0),
                  escapable.test(e)
                    ? '"' +
                      e.replace(escapable, function(e) {
                        var t = meta[e];
                        return "string" == typeof t
                          ? t
                          : "\\u" +
                              ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
                      }) +
                      '"'
                    : '"' + e + '"'
                );
              }
              function str(e, t) {
                var n,
                  i,
                  r,
                  o,
                  a,
                  s = gap,
                  d = t[e];
                switch (
                  (d &&
                    "object" == typeof d &&
                    "function" == typeof d.toJSON &&
                    (d = d.toJSON(e)),
                  "function" == typeof rep && (d = rep.call(t, e, d)),
                  typeof d)
                ) {
                  case "string":
                    return quote(d);
                  case "number":
                    return isFinite(d) ? String(d) : "null";
                  case "boolean":
                  case "null":
                    return String(d);
                  case "object":
                    if (!d) return "null";
                    if (
                      ((gap += indent),
                      (a = []),
                      "[object Array]" === Object.prototype.toString.apply(d))
                    ) {
                      for (o = d.length, n = 0; o > n; n += 1)
                        a[n] = str(n, d) || "null";
                      return (
                        (r =
                          0 === a.length
                            ? "[]"
                            : gap
                            ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]"
                            : "[" + a.join(",") + "]"),
                        (gap = s),
                        r
                      );
                    }
                    if (rep && "object" == typeof rep)
                      for (o = rep.length, n = 0; o > n; n += 1)
                        "string" == typeof rep[n] &&
                          ((i = rep[n]),
                          (r = str(i, d)),
                          r && a.push(quote(i) + (gap ? ": " : ":") + r));
                    else
                      for (i in d)
                        Object.prototype.hasOwnProperty.call(d, i) &&
                          ((r = str(i, d)),
                          r && a.push(quote(i) + (gap ? ": " : ":") + r));
                    return (
                      (r =
                        0 === a.length
                          ? "{}"
                          : gap
                          ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}"
                          : "{" + a.join(",") + "}"),
                      (gap = s),
                      r
                    );
                }
              }
              "function" != typeof Date.prototype.toJSON &&
                ((Date.prototype.toJSON = function(e) {
                  return isFinite(this.valueOf())
                    ? this.getUTCFullYear() +
                        "-" +
                        f(this.getUTCMonth() + 1) +
                        "-" +
                        f(this.getUTCDate()) +
                        "T" +
                        f(this.getUTCHours()) +
                        ":" +
                        f(this.getUTCMinutes()) +
                        ":" +
                        f(this.getUTCSeconds()) +
                        "Z"
                    : null;
                }),
                (String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(
                  e
                ) {
                  return this.valueOf();
                }));
              var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap,
                indent,
                meta = {
                  "\b": "\\b",
                  "	": "\\t",
                  "\n": "\\n",
                  "\f": "\\f",
                  "\r": "\\r",
                  '"': '\\"',
                  "\\": "\\\\"
                },
                rep;
              "function" != typeof JSON.stringify &&
                (JSON.stringify = function(e, t, n) {
                  var i;
                  if (((gap = ""), (indent = ""), "number" == typeof n))
                    for (i = 0; n > i; i += 1) indent += " ";
                  else "string" == typeof n && (indent = n);
                  if (
                    ((rep = t),
                    t &&
                      "function" != typeof t &&
                      ("object" != typeof t || "number" != typeof t.length))
                  )
                    throw new Error("JSON.stringify");
                  return str("", { "": e });
                }),
                "function" != typeof JSON.parse &&
                  (JSON.parse = function(text, reviver) {
                    function walk(e, t) {
                      var n,
                        i,
                        r = e[t];
                      if (r && "object" == typeof r)
                        for (n in r)
                          Object.prototype.hasOwnProperty.call(r, n) &&
                            ((i = walk(r, n)),
                            i !== undefined ? (r[n] = i) : delete r[n]);
                      return reviver.call(e, t, r);
                    }
                    var j;
                    if (
                      ((text = String(text)),
                      (cx.lastIndex = 0),
                      cx.test(text) &&
                        (text = text.replace(cx, function(e) {
                          return (
                            "\\u" +
                            ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                          );
                        })),
                      /^[\],:{}\s]*$/.test(
                        text
                          .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                          .replace(
                            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                            "]"
                          )
                          .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
                      ))
                    )
                      return (
                        (j = eval("(" + text + ")")),
                        "function" == typeof reviver ? walk({ "": j }, "") : j
                      );
                    throw new SyntaxError("JSON.parse");
                  });
            })(),
            "function" != typeof JSON.decycle &&
              !(function() {
                function e(e) {
                  var t = "";
                  switch (e.nodeType) {
                    case e.ELEMENT_NODE:
                      (t = e.nodeName.toLowerCase()),
                        e.id.length
                          ? (t += "#" + e.id)
                          : (e.className.length &&
                              (t += "." + e.className.replace(/ /, ".")),
                            "textContent" in e &&
                              (t +=
                                "{textContent:" +
                                (e.textContent.length < 20
                                  ? e.textContent
                                  : e.textContent.substr(0, 20) + "...") +
                                "}"));
                      break;
                    default:
                      (t = e.nodeName),
                        null !== e.nodeValue &&
                          (t +=
                            "{value:" +
                            (e.nodeValue.length < 20
                              ? e.nodeValue
                              : e.nodeValue.substr(0, 20) + "...") +
                            "}");
                  }
                  return t;
                }
                JSON.decycle = function(t, n) {
                  var i = [],
                    n = "undefined" == typeof n ? !1 : n,
                    r = [];
                  return (function o(t, a) {
                    var s, d, u;
                    if (
                      n &&
                      "object" == typeof t &&
                      null !== t &&
                      "nodeType" in t
                    )
                      return e(t);
                    if (
                      !(
                        "object" != typeof t ||
                        null === t ||
                        t instanceof Boolean ||
                        t instanceof Date ||
                        t instanceof Number ||
                        t instanceof RegExp ||
                        t instanceof String
                      )
                    ) {
                      for (s = 0; s < i.length; s += 1)
                        if (i[s] === t) return { $ref: r[s] };
                      if (
                        (i.push(t),
                        r.push(a),
                        "[object Array]" === Object.prototype.toString.apply(t))
                      )
                        for (u = [], s = 0; s < t.length; s += 1)
                          u[s] = o(t[s], a + "[" + s + "]");
                      else {
                        u = {};
                        for (d in t)
                          Object.prototype.hasOwnProperty.call(t, d) &&
                            (u[d] = o(t[d], a + "[" + JSON.stringify(d) + "]"));
                      }
                      return u;
                    }
                    return t;
                  })(t, "$");
                };
              })(),
            "function" != typeof JSON.retrocycle &&
              (JSON.retrocycle = function retrocycle($) {
                var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
                return (
                  (function rez(value) {
                    var i, item, name, path;
                    if (value && "object" == typeof value)
                      if (
                        "[object Array]" ===
                        Object.prototype.toString.apply(value)
                      )
                        for (i = 0; i < value.length; i += 1)
                          (item = value[i]),
                            item &&
                              "object" == typeof item &&
                              ((path = item.$ref),
                              "string" == typeof path && px.test(path)
                                ? (value[i] = eval(path))
                                : rez(item));
                      else
                        for (name in value)
                          "object" == typeof value[name] &&
                            ((item = value[name]),
                            item &&
                              ((path = item.$ref),
                              "string" == typeof path && px.test(path)
                                ? (value[name] = eval(path))
                                : rez(item)));
                  })($),
                  $
                );
              });
          var memoizedWarnDep = _.memoize(function(e, t) {
            (e = e || "Function"), (t = t ? " and " + t : "");
            var n = e + " deprecated" + t;
            return pendo.log(n), n;
          });
          (pendo.SHADOW_STYLE = ""),
            _.extend(pendo, {
              _showElementGuide: deprecateFn(
                showTooltipGuide,
                "_showElementGuide",
                "is going away"
              ),
              flushNow: deprecateFn(
                flushNow,
                "pendo.flushNow",
                "is going away"
              ),
              flushEventCache: deprecateFn(
                null,
                "pendo.flushEventCache",
                "is gone"
              ),
              HOST: HOST,
              MAX_LENGTH: ENCODED_EVENT_MAX_LENGTH,
              MAX_NUM_EVENTS: MAX_NUM_EVENTS,
              _createToolTip: deprecateFn(
                createTooltipGuide,
                "pendo._createToolTip",
                "is going away"
              ),
              _get_tooltip_dimensions: deprecateFn(
                getTooltipDimensions,
                "pendo._get_tooltip_dimensions",
                "is going away"
              ),
              _isOldIE: deprecateFn(isOldIE, "pendo._isOldIE", "is going away"),
              _logMessage: deprecateFn(
                writeMessage,
                "pendo._logMessage",
                "is going away"
              ),
              _sendEvent: deprecateFn(null, "pendo._sendEvent", "is gone"),
              _sendGuideEvent: deprecateFn(
                writeGuideEvent,
                "pendo._sendGuideEvent",
                "is going away"
              ),
              _stopEvents: locked,
              _storeInCache: deprecateFn(
                null,
                "pendo._storeInCache",
                "is gone"
              ),
              _writeEventImgTag: deprecateFn(
                writeEvent,
                "pendo._writeEventImgTag",
                "is going away"
              ),
              _writeImgTag: deprecateFn(
                writeImgTag,
                "pendo._writeImgTag",
                "is going away"
              ),
              attachEvent: deprecateFn(
                attachEvent,
                "pendo.attachEvent",
                "is going away"
              ),
              detachEvent: deprecateFn(
                detachEvent,
                "pendo.detachEvent",
                "is going away"
              ),
              getText: deprecateFn(getText, "pendo.getText", "is going away"),
              getUA: deprecateFn(getUA, "pendo.getUA", "is going away"),
              ifDebugThen: deprecateFn(null, "pendo.ifDebugThen", "is gone"),
              send_event: deprecateFn(
                collectEvent,
                "pendo.send_event",
                "has changed to pendo.cache.createEvent"
              ),
              shouldSendEvents: deprecateFn(
                isUnlocked,
                "pendo.shouldSendEvents",
                "has changed to pendo.transmit.isSendingEvents"
              ),
              stopSendingEvents: deprecateFn(
                lockEvents,
                "pendo.stopSendingEvents",
                "has changed to pendo.transmit.stopSendEvents"
              ),
              wire_page: deprecateFn(
                wirePage,
                "pendo.wire_page",
                "is going away"
              ),
              findGuideBy: findGuideBy,
              findGuideById: findGuideById,
              findStepInGuide: findStepInGuide,
              _updateGuideStepStatus: _updateGuideStepStatus,
              _addCloseButton: addCloseButton,
              initialize: initialize,
              getEventCache: getGuideEventCache,
              processEventCache: processGuideEventCache,
              isGuideShown: isGuideShown,
              _getNextStepInMultistep: getNextStepInMultistep,
              badgeDiv: launcherBadge && launcherBadge.element,
              launcherToolTipDiv: launcherTooltipDiv,
              updateOptions: updateOptions,
              createLauncher: createLauncher,
              initLauncher: initLauncher,
              _addGuideToLauncher: addGuideToLauncher,
              isAnonymousVisitor: isAnonymousVisitor,
              DEFAULT_VISITOR_ID: DEFAULT_VISITOR_ID,
              shouldIdentityChange: shouldIdentityChange,
              read: read,
              write: write,
              _delete_cookie: clearStorage,
              _set_cookie: setCookie,
              _get_cookie: getCookie,
              get_cookie_key: getPendoCookieKey,
              ENV: ENV,
              eventCache: eventCache,
              _getOpacityStyles: deprecateFn(
                function() {},
                "pendo._getOpacityStyles",
                "is going away"
              ),
              setStyle: setStyle,
              _createGuideEvent: createGuideEvent,
              seenGuide: seenGuide,
              dismissedGuide: dismissedGuide,
              advancedGuide: advancedGuide,
              seenTime: seenTime,
              placeBadge: placeBadge,
              isBadge: isBadge,
              showPreview: deprecateFn(
                showPreview,
                "pendo.showPreview",
                "is going away"
              ),
              removeAllBadges: removeAllBadges,
              tellMaster: tellMaster,
              DEFAULT_TIMER_LENGTH: DEFAULT_TIMER_LENGTH,
              registerMessageHandler: registerMessageHandler,
              _get_offset: getOffsetPosition,
              _shouldAutoDisplayGuide: shouldAutoDisplayGuide,
              removeBadge: removeBadge,
              _showLightboxGuide: showLightboxGuide,
              _showGuide: showGuide,
              getElementForGuideStep: getElementForGuideStep,
              isElementVisible: isElementVisible,
              getTooltipDivId: getStepDivId,
              setupWatchOnTooltip: setupWatchOnElement,
              detectMaster: detectMaster,
              listenToMaster: listenToMaster,
              start: whenLoadedCall,
              SEND_INTERVAL: SEND_INTERVAL,
              stageGuideEvent: stageGuideEvent,
              startStagedTimer: startStagedTimer,
              isURLValid: isURLValid,
              getURL: getURL,
              _get_screen_dim: getScreenDimensions,
              _isInViewport: _isInViewport,
              _getCss3Prop: _getCss3Prop,
              waitThenStartGuides: waitThenLoop
            });
          var debugging = {
            getEventCache: function() {
              return [].concat(eventCache);
            },
            getAllGuides: function() {
              return [].concat(getActiveGuides());
            },
            getAutoGuides: function() {
              return AutoDisplay.sortAndFilter(
                getActiveGuides(),
                pendo.autoOrdering
              );
            },
            getBadgeGuides: function() {
              return _.filter(getActiveGuides(), isBadge);
            },
            getLauncherGuides: function() {
              return _.filter(getActiveGuides(), isLauncher);
            },
            getEventHistory: function() {
              return eventHistory;
            },
            getOriginalOptions: function() {
              return originalOptions;
            },
            getBody: dom.getBody,
            isMobileUserAgent: isMobileUserAgent,
            areGuidesDelayed: areGuidesDelayed,
            getMetadata: function() {
              return getMetadata();
            },
            isStagingServer: function() {
              return "undefined" == typeof PendoConfig
                ? !1
                : shouldLoadStagingAgent(PendoConfig);
            },
            AutoDisplay: AutoDisplay
          };
          _.extend(debug, debugging);
          var FlexboxPolyfill = (function() {
              function e(e) {
                var t = e.cloneNode(),
                  n = FlexboxPolyfill.getPendoVisualElements(e.children),
                  i = FlexboxPolyfill.getPendoInlineUIElements(e.children);
                t.innerHTML = "";
                for (var r = 0; r < n.length; r++)
                  pendo.BuildingBlocks.BuildingBlockGuides.isElementHiddenInGuide(
                    n[r]
                  )
                    ? t.appendChild(n[r])
                    : t.appendChild(
                        FlexboxPolyfill.wrapElementInMockFlexboxContainer(n[r])
                      );
                for (var o = 0; o < i.length; o++) t.appendChild(i[o]);
                return e.parentNode.replaceChild(t, e), t;
              }
              function t(e, t) {
                for (
                  var n =
                      parseInt(e.offsetWidth) -
                      parseInt(e.style.paddingLeft) -
                      parseInt(e.style.paddingRight),
                    i = FlexboxPolyfill.getPendoVisualElements(e.children),
                    r = 0;
                  r < i.length;

                )
                  r = FlexboxPolyfill.formatPseudoRow(n, i, r, t);
              }
              function n(e, t, n, i) {
                for (var r = 0, o = n, a = []; e > r && o < t.length; ) {
                  var s = parseInt(t[o].offsetWidth),
                    d = t[o].offsetWidth / s > 0;
                  if ((d && s++, (r += s), r > e && 1 !== t.length)) {
                    (r -= s), o--;
                    break;
                  }
                  a.push(t[o]), o++;
                }
                var u = Math.min(t.length - 1, o),
                  l = e - r;
                return FlexboxPolyfill.addMarginsToRow(a, l, i), u + 1;
              }
              function i(e, t, n) {
                if (!(e.length < 1))
                  switch (n) {
                    case "space-between":
                      FlexboxPolyfill.spaceBetween(e, t);
                      break;
                    case "space-around":
                      FlexboxPolyfill.spaceAround(e, t);
                      break;
                    case "space-evenly":
                      FlexboxPolyfill.spaceEvenly(e, t);
                      break;
                    case "center":
                      FlexboxPolyfill.center(e, t);
                      break;
                    case "flex-start":
                      FlexboxPolyfill.flexStart(e, t);
                      break;
                    case "flex-end":
                      FlexboxPolyfill.flexEnd(e, t);
                  }
              }
              function r(e) {
                var t = e.getAttribute("class");
                return !!(t && t.indexOf("pendo-inline-ui") > -1);
              }
              function o(e) {
                return _.filter(e, function(e) {
                  return !r(e);
                });
              }
              function a(e) {
                return _.filter(e, function(e) {
                  return r(e);
                });
              }
              function s() {
                var e = document.createElement("div");
                return (
                  (e.style.display = "inline-block"),
                  (e.style["vertical-align"] = "top"),
                  e.setAttribute("class", "pendo-mock-flexbox-element"),
                  e
                );
              }
              function d(e) {
                var t,
                  n = e.getAttribute("class") || "",
                  i = -1 !== n.indexOf("pendo-block-wrapper");
                if (
                  (i && (t = e.children[0].offsetWidth + "px"),
                  !n || n.indexOf("pendo-mock-flexbox-element") < 0)
                ) {
                  var r = FlexboxPolyfill.createFlexContainer();
                  return (
                    r.appendChild(e),
                    i && (r.children[0].children[0].style.width = t),
                    r
                  );
                }
                return e;
              }
              function u(e, t) {
                for (
                  var n = t / Math.max(e.length - 1, 1), i = 0;
                  i < e.length - 1;
                  i++
                )
                  e[i].style.marginRight = n + "px";
                e[e.length - 1].style.marginRight = "0px";
              }
              function l(e, t) {
                for (var n = t / (2 * e.length), i = 0; i < e.length; i++)
                  (e[i].style.marginRight = n + "px"),
                    (e[i].style.marginLeft = n + "px");
              }
              function c(e, t) {
                for (var n = t / (e.length + 1), i = 0; i < e.length; i++)
                  (e[i].style.marginLeft = n + "px"),
                    (e[i].style.marginRight = "0px");
                e[e.length - 1].style.marginRight = n + "px";
              }
              function p(e, t) {
                for (var n = t / 2, i = 0; i < e.length; i++)
                  (e[i].style.marginLeft = "0px"),
                    (e[i].style.marginRight = "0px");
                (e[0].style.marginLeft = n + "px"),
                  (e[e.length - 1].style.marginRight = n + "px");
              }
              function f(e, t) {
                for (var n = t, i = 0; i < e.length; i++)
                  e[i].style.marginRight = "0px";
                e[e.length - 1].style.marginRight = n + "px";
              }
              function h(e, t) {
                for (var n = t, i = 0; i < e.length; i++)
                  e[i].style.marginLeft = "0px";
                e[0].style.marginLeft = n + "px";
              }
              return {
                addMarginsToRow: i,
                center: p,
                createFlexContainer: s,
                flexEnd: h,
                flexStart: f,
                formatPseudoRow: n,
                getPendoInlineUIElements: a,
                getPendoVisualElements: o,
                initializeFlexboxContainer: e,
                isPendoInlineUIElement: r,
                justifyContent: t,
                spaceAround: l,
                spaceBetween: u,
                spaceEvenly: c,
                wrapElementInMockFlexboxContainer: d
              };
            })(),
            BuildingBlockTemplates = (function() {
              function e(e, t, a, s) {
                var d = s || pendo.guides;
                switch (e) {
                  case "pendo_resource_center_module_list_item":
                    return n(t, a, d);
                  case "pendo_resource_center_guide_list_item":
                    return i(t, a, d);
                  case "pendo_resource_center_onboarding_item":
                    return r(t, a, d);
                  case "pendo_resource_center_onboarding_progress_bar":
                    return o(t, a, d);
                  default:
                    return [];
                }
              }
              function t(e, n, i) {
                if (
                  (e.content && (e.content = _.template(e.content)(n)),
                  e.children)
                )
                  for (var r = 0; r < e.children.length; r++)
                    t(e.children[r], n);
                return e;
              }
              function n(e, n, i) {
                var r = n.getGuide(),
                  o = r.attributes.resourceCenter.children;
                return _.reduce(
                  o,
                  function(r, o, a) {
                    var s = _.find(i, function(e) {
                      return e.id === o.id;
                    });
                    if (pendo.designerEnabled) s = o;
                    else if (!s || !s.hasResourceCenterContent) return r;
                    var d = JSON.parse(JSON.stringify(e));
                    (d.props.id = d.props.id + "-" + a),
                      d.actions || (d.actions = []);
                    var u = {
                      action: "renderResourceCenterModule",
                      source: d.props.id,
                      destination: "EventRouter",
                      parameters: [
                        { name: "guideId", type: "string", value: s.id }
                      ],
                      uiMetadata: {},
                      eventType: "click"
                    };
                    return (
                      pendo.designerEnabled || d.actions.push(u),
                      (d = t(d, o)),
                      r.concat(BuildingBlockGuides.buildNodeFromJSON(d, n, i))
                    );
                  },
                  []
                );
              }
              function i(e, n, i) {
                var r = n.getGuide().attributes.resourceCenter.children;
                return _.reduce(
                  r,
                  function(r, o, a) {
                    var s = _.find(i, function(e) {
                      return e.id === o.id;
                    });
                    if (!s) return r;
                    var d = JSON.parse(JSON.stringify(e));
                    (d.props.id = d.props.id + "-" + a),
                      d.actions || (d.actions = []);
                    var u = {
                      action: "showGuide",
                      source: d.props.id,
                      destination: "EventRouter",
                      parameters: [
                        { name: "guideId", type: "string", value: s.id }
                      ],
                      uiMetadata: {},
                      eventType: "click"
                    };
                    return (
                      pendo.designerEnabled || d.actions.push(u),
                      (d = t(d, o)),
                      r.concat(BuildingBlockGuides.buildNodeFromJSON(d, n, i))
                    );
                  },
                  []
                );
              }
              function r(e, n, i) {
                var r = n.getGuide().attributes.resourceCenter.children;
                return _.reduce(
                  r,
                  function(r, o, a) {
                    var s = _.find(i, function(e) {
                      return e.id === o.id;
                    });
                    if (pendo.designerEnabled) s = o;
                    else if (!s) return r;
                    var d = JSON.parse(JSON.stringify(e));
                    (d.props.id = d.props.id + "-" + a),
                      d.actions || (d.actions = []);
                    var u = {
                      action: "showGuide",
                      source: d.props.id,
                      destination: "EventRouter",
                      parameters: [
                        { name: "guideId", type: "string", value: s.id }
                      ],
                      uiMetadata: {},
                      eventType: "click"
                    };
                    pendo.designerEnabled || d.actions.push(u);
                    var l = s.getTotalSteps(),
                      c = s.getSeenSteps(),
                      p = parseInt((c / l) * 100),
                      f = BuildingBlockGuides.findDomBlockInDomJson(d, function(
                        e
                      ) {
                        return e.svgWidgetId;
                      });
                    f.svgAttributes.fillCircle.percentComplete = p;
                    var h = "Step " + c + " of " + l;
                    return (
                      (o.stepProgress = h),
                      (d = t(d, o)),
                      r.concat(BuildingBlockGuides.buildNodeFromJSON(d, n, i))
                    );
                  },
                  []
                );
              }
              function o(e, n, i) {
                var r = n.getGuide().attributes.resourceCenter.children,
                  o = 0,
                  a = 0;
                _.forEach(r, function(e) {
                  var t = _.find(i, function(t) {
                    return t.id === e.id;
                  });
                  if (pendo.designerEnabled) t = e;
                  else if (!t) return e;
                  (o += t.getTotalSteps()), (a += t.getSeenSteps());
                });
                var s = parseInt((a / o) * 100);
                isNaN(s) && (s = 0);
                var d = { totalPercentComplete: s + "%" },
                  u = JSON.parse(JSON.stringify(e));
                u = t(u, d);
                var l = BuildingBlockGuides.findDomBlockInDomJson(u, function(
                  e
                ) {
                  return (
                    e.props &&
                    e.props.id &&
                    -1 !== e.props.id.indexOf("pendo-progress-bar-fill")
                  );
                });
                return (
                  (l.props.style.width = d.totalPercentComplete),
                  [BuildingBlockGuides.buildNodeFromJSON(u, n, i)]
                );
              }
              return { buildNodesFromTemplate: e };
            })(),
            BuildingBlockTooltips = (function() {
              function e(e, t, r, o) {
                var a = getOffsetPosition(t);
                if (0 === a.height && 0 === a.width) return null;
                var s = r.guideElement;
                s.addClass(buildTooltipCSSName());
                var d = function(e) {
                    return "pendo-guide-container" === e.props.id;
                  },
                  l = BuildingBlockGuides.findDomBlockInDomJson(e, d);
                if (l) {
                  var c = r.attributes.layoutDir,
                    p = { height: o.offsetHeight, width: o.offsetWidth },
                    f = {
                      height: parseInt(l.props["data-caret-height"]) || 0,
                      width: parseInt(l.props["data-caret-width"]) || 0,
                      backgroundColor: l.props.style["background-color"],
                      offset: 10
                    };
                  if ((n(r), l.props.style.border)) {
                    var h = l.props.style.border.split(" ");
                    (f.borderColor = h[2]), (f.borderWidth = parseInt(h[0]));
                  }
                  var g = i(a, p, f, c);
                  r && (r.dim = g),
                    (o.style.position = "absolute"),
                    a.fixed && s.css({ position: "fixed" }),
                    f.height && f.width && u(s, g, f);
                  var v = "300000";
                  return (
                    o &&
                      o.props &&
                      o.props["z-index"] &&
                      (v = o.props["z-index"]),
                    s.css({
                      left: g.left,
                      top: g.top,
                      position: "absolute",
                      "z-index": v
                    }),
                    s[0]
                  );
                }
              }
              function t(e, t) {
                var n = Sizzle(t.elementPathRule)[0],
                  i = function() {
                    t.attributes.advanceActions.elementHover
                      ? detachEvent(n, "mouseover", i, !0)
                      : t.attributes.advanceActions.elementClick &&
                        detachEvent(n, "click", i, !0),
                      pendo.onGuideAdvanced();
                  };
                attachEvent(n, e, i, !0);
              }
              function n(e) {
                e.attributes.advanceActions &&
                  e.elementPathRule &&
                  (e.attributes.advanceActions.elementHover
                    ? t("mouseover", e)
                    : e.attributes.advanceActions.elementClick &&
                      t("click", e));
              }
              function i(e, t, n, i) {
                var s = pendo._get_screen_dim(),
                  d = i || "auto",
                  u = { width: Math.min(t.width, s.width), height: t.height };
                (u.layoutDir = d),
                  (u.hbias = r(e, s, d)),
                  (u.layoutDir = o(u, s, e, d));
                var l = a(u, e);
                return (
                  (u.top = l.top),
                  (u.left = l.left),
                  "top" === u.layoutDir
                    ? (u.top -= n.height)
                    : "bottom" === u.layoutDir
                    ? (u.top += n.height)
                    : "right" === u.layoutDir
                    ? (u.left += n.height)
                    : "left" === u.layoutDir && (u.left -= n.height),
                  u
                );
              }
              function r(e, t, n) {
                if ("right" === n || "left" === n)
                  return pendo.log("Setting layout position to " + n), n;
                var i = t.width / 3,
                  r = i,
                  o = 2 * i;
                return r < e.left && e.left < o
                  ? "center"
                  : e.left < t.width / 2
                  ? "right"
                  : "left";
              }
              function o(e, t, n, i) {
                if (i && "auto" !== i) return i;
                var r = n.top - documentScrollTop(),
                  o = n.left - documentScrollLeft(),
                  a = o + n.width;
                return r < t.height / 3
                  ? "bottom"
                  : r > (2 * t.height) / 3 || "center" === e.hbias
                  ? "top"
                  : o < e.width && t.width - a < e.width
                  ? "bottom"
                  : e.hbias;
              }
              function a(e, t) {
                return "top" === e.layoutDir || "bottom" === e.layoutDir
                  ? s(e, t, e.layoutDir, e.hbias)
                  : d(e, t, e.hbias);
              }
              function s(e, t, n, i) {
                var r = e.height,
                  o = e.width,
                  a = 10,
                  s = { top: null, left: null };
                return (
                  "bottom" === n
                    ? (s.top = t.top + t.height)
                    : "top" === n && (s.top = t.top - r),
                  "right" === i
                    ? (s.left = t.left + t.width / 2 - a)
                    : "left" === i
                    ? (s.left = t.left - o + t.width / 2 + a)
                    : (s.left = t.left + t.width / 2 - o / 2),
                  s
                );
              }
              function d(e, t, n) {
                var i = e.height,
                  r = e.width,
                  o = { top: null, left: null };
                return (
                  (o.top = t.top - i / 2 + t.height / 2),
                  "right" === n
                    ? (o.left = t.left + t.width)
                    : "left" === n && (o.left = Math.max(0, t.left - r)),
                  o
                );
              }
              function u(e, t, n) {
                var i = document.createElement("div");
                i.setAttribute("class", "pendo-tooltip-caret"),
                  (i.style.position = "absolute"),
                  (i.style.zIndex = 11),
                  ("top" === t.layoutDir || "bottom" === t.layoutDir) &&
                    l(i, e, t, n),
                  ("left" === t.layoutDir || "right" === t.layoutDir) &&
                    c(i, e, t, n);
                var r = e.find("#pendo-guide-container")[0].parentNode;
                if ((r.appendChild(i), n.borderWidth)) {
                  var o = p(i, n, t.layoutDir);
                  r.appendChild(o);
                }
              }
              function l(e, t, n, i) {
                if (
                  ((e.style["border-left"] = i.width + "px solid transparent"),
                  (e.style["border-right"] = i.width + "px solid transparent"),
                  "left" === n.hbias)
                ) {
                  var r = n.width - 2 * i.width - i.offset;
                  (e.style.left = r + "px"), (n.left += i.offset + i.width);
                } else
                  "right" === n.hbias
                    ? ((e.style.left = i.offset + "px"),
                      (n.left -= i.offset + i.width))
                    : (e.style.left = n.width / 2 - i.width + "px");
                if ("bottom" === n.layoutDir) {
                  e.style["border-bottom"] =
                    i.height + "px solid " + i.backgroundColor;
                  var o = -1 * i.height;
                  i.borderWidth && (o += i.borderWidth),
                    (e.style.top = o + "px");
                }
                if ("top" === n.layoutDir) {
                  e.style["border-top"] =
                    i.height + "px solid " + i.backgroundColor;
                  var a = -1 * i.height;
                  i.borderWidth && (a += i.borderWidth),
                    (e.style.bottom = a + "px");
                }
                return e;
              }
              function c(e, t, n, i) {
                if (
                  ((e.style["border-top"] = i.width + "px solid transparent"),
                  (e.style["border-bottom"] = i.width + "px solid transparent"),
                  (e.style.top = n.height / 2 - i.width + "px"),
                  "left" === n.layoutDir)
                ) {
                  e.style["border-left"] =
                    i.height + "px solid " + i.backgroundColor;
                  var r = -1 * i.height;
                  i.borderWidth && (r += i.borderWidth),
                    (e.style.right = r + "px");
                }
                if ("right" === n.layoutDir) {
                  e.style["border-right"] =
                    i.height + "px solid " + i.backgroundColor;
                  var o = -1 * i.height;
                  i.borderWidth && (o += i.borderWidth),
                    (e.style.left = o + "px");
                }
                return e;
              }
              function p(e, t, n) {
                var i = e.cloneNode();
                i.setAttribute("class", "pendo-tooltip-caret-border"),
                  (i.style.zIndex = 10);
                for (
                  var r = ["Top", "Right", "Bottom", "Left"], o = 0;
                  o < r.length;
                  o++
                ) {
                  var a = "border" + r[o] + "Width",
                    s = "border" + r[o] + "Color";
                  i.style[a] &&
                    ((i.style[a] = parseInt(i.style[a]) + t.borderWidth + "px"),
                    (i.style[s] = f(i.style[s], t.borderColor)));
                }
                return (
                  "top" === n &&
                    ((i.style.left =
                      parseInt(i.style.left) - t.borderWidth / 2 + "px"),
                    (i.style.bottom =
                      parseInt(i.style.bottom) - t.borderWidth + "px")),
                  "bottom" === n &&
                    ((i.style.left =
                      parseInt(i.style.left) - t.borderWidth + "px"),
                    (i.style.top =
                      parseInt(i.style.top) - t.borderWidth + "px")),
                  "right" === n &&
                    ((i.style.top =
                      parseInt(i.style.top) - t.borderWidth / 2 + "px"),
                    (i.style.left =
                      parseInt(i.style.left) - t.borderWidth + "px")),
                  "left" === n &&
                    ((i.style.top =
                      parseInt(i.style.top) - t.borderWidth / 2 + "px"),
                    (i.style.right =
                      parseInt(i.style.right) - t.borderWidth + "px")),
                  i
                );
              }
              function f(e, t) {
                return "transparent" === e ? e : t;
              }
              function h(e, t) {
                if (t) {
                  var n = getElementForGuideStep(e),
                    r = getOffsetPosition(n);
                  if (checkPlacementChanged(r)) {
                    var o = e.attributes.layoutDir,
                      a = dom(t).find("#pendo-guide-container"),
                      s = { height: t.offsetHeight, width: t.offsetWidth },
                      d = {
                        height:
                          parseInt(a[0].getAttribute("data-caret-height")) || 0,
                        width:
                          parseInt(a[0].getAttribute("data-caret-width")) || 0,
                        backgroundColor: a[0].style["background-color"],
                        offset: 10
                      },
                      u = i(r, s, d, o),
                      l = e.guideElement;
                    l.css({
                      top: u.top,
                      left: u.left,
                      position: r.fixed ? "fixed" : l[0].style.position
                    });
                  }
                }
              }
              return {
                createBBTooltip: e,
                getBBTooltipDimensions: i,
                determineBBHorizontalBias: r,
                determineTooltipPosition: o,
                positionBBTooltipWithBias: a,
                calculateToolTipPositionForTopBottom: s,
                calculateToolTipPositionForLeftRight: d,
                buildTooltipCaret: u,
                styleTopOrBottomCaret: l,
                styleLeftOrRightCaret: c,
                buildBorderCaret: p,
                determineBorderCaretColor: f,
                placeBBTooltip: h
              };
            })(),
            BuildingBlockGuides = (function() {
              function e(t) {
                return t.props &&
                  t.props.id &&
                  0 === t.props.id.indexOf("pendo-g-")
                  ? t
                  : t.children
                  ? _.find(t.children, function(t) {
                      return e(t);
                    })
                  : void 0;
              }
              function t(e, t, n) {
                var i = BuildingBlockGuides.findGuideContainerJSON(e),
                  r = t.getGuide();
                (t.containerId = i && i.props && i.props.id),
                  (t.element = getElementForGuideStep(t));
                var o = BuildingBlockGuides.buildNodeFromJSON(e, t, n);
                t.guideElement = o;
                var a = o.find("#" + t.containerId)[0];
                a && (a.style.visibility = "hidden"),
                  o.appendTo(getBody()),
                  l(t.containerId),
                  f(t.containerId);
                var s;
                return (
                  a &&
                    a.attributes["data-vertical-alignment"] &&
                    (s =
                      "Relative to Element" ===
                      a.attributes["data-vertical-alignment"].value),
                  s &&
                    ((t.attributes.calculatedType = "tooltip"),
                    BuildingBlockTooltips.createBBTooltip(e, t.element, t, a),
                    scrollIntoView(t.element),
                    scrollToTooltip(t.element, a)),
                  r.hasResourceCenterContent &&
                    r.skipResourceCenterHomeView &&
                    BuildingBlockResourceCenter.replaceResourceCenterContent(
                      r.moduleIdToReplaceHomeViewWith,
                      [{ value: "none" }, { value: "left" }]
                    ),
                  a && (a.style.visibility = "visible"),
                  t.elements.push(t.guideElement[0]),
                  o
                );
              }
              function n(e, t, n) {
                return e.templateName
                  ? BuildingBlockTemplates.buildNodesFromTemplate(
                      e.templateName,
                      e,
                      t,
                      n
                    )
                  : [i(e, t, n)];
              }
              function i(e, t, n) {
                var i = pendo.dom("<" + e.type + "></" + e.type + ">"),
                  r = e.props && e.props.id;
                if ("pendo-backdrop" === r) {
                  if (
                    t.attributes &&
                    t.attributes.blockOutUI &&
                    t.attributes.blockOutUI.enabled
                  ) {
                    var o = _.throttle(_.partial(S, t), 25);
                    t.attachEvent(window, "scroll", o, !0);
                  }
                  return g(t);
                }
                if (
                  (_.each(e.props, function(n, r) {
                    "style" === r
                      ? i.css(e.props.style)
                      : "data-pendo-code-block" === r && n === !0
                      ? i.addClass("pendo-code-block").html(t.getContent())
                      : i.attr(r, n);
                  }),
                  e.content && i.text(e.content),
                  "style" === e.type &&
                    (i.styleSheet
                      ? (i.styleSheet.cssText = BuildingBlockGuides.buildStyleTagContent(
                          e.css
                        ))
                      : i.text(
                          BuildingBlockGuides.buildStyleTagContent(e.css)
                        )),
                  e.svgWidgetId)
                ) {
                  var a = BuildingBlockSvgs.buildSvgNode(e.svgWidgetId, e);
                  a.appendTo(i);
                }
                var s = e.props.id && -1 !== e.props.id.indexOf("badge");
                if (
                  ("img" !== e.type ||
                    s ||
                    BuildingBlockGuides.recalculateGuideHeightOnImgLoad(i, t),
                  e.actions && e.actions.length)
                )
                  for (var d = 0; d < e.actions.length; d++)
                    if (
                      (BuildingBlockGuides.bindActionToNode(i, e.actions[d], t),
                      "renderGuidesListItem" === e.actions[d].action)
                    ) {
                      var u = pendo.findGuideById(e.actions[d].parameters[0]);
                      u ? i.text(u.name) : i.attr("style", "display: none;");
                    }
                if (e.children)
                  for (var l = 0; l < e.children.length; l++) {
                    var c = BuildingBlockGuides.buildNodesFromJSON(
                      e.children[l],
                      t,
                      n
                    );
                    _.each(c, function(e) {
                      e && e.appendTo(i);
                    });
                  }
                return i;
              }
              function r(t, n) {
                t.on("load", function(t) {
                  (t.srcElement.style.display = "none"),
                    t.srcElement.offsetHeight,
                    (t.srcElement.style.display = "");
                  var i = {};
                  !n.containerId && n.domJson && (i = e(n.domJson));
                  var r = n.containerId || (i.props && i.props.id) || "";
                  f(r);
                });
              }
              function o(e, t, n) {
                e.on(t.eventType, function(i) {
                  if (t.designerAction)
                    pendo.designerv2.designerActions[t.action](e, t.parameters);
                  else {
                    var r = {
                      action: t.action,
                      params: t.parameters,
                      step: n,
                      ignore: !!t.ignore,
                      srcElement: i.srcElement
                    };
                    "showElements" === t.action || "hideElements" === t.action
                      ? i.srcElement &&
                        i.srcElement.getAttribute("id") === t.source
                        ? n.eventRouter.eventable.trigger("pendoEvent", r)
                        : i.target &&
                          i.target.getAttribute("id") === t.source &&
                          n.eventRouter.eventable.trigger("pendoEvent", r)
                      : n.eventRouter.eventable.trigger("pendoEvent", r);
                  }
                });
              }
              function a(e) {
                var t = "";
                return (
                  _.each(e, function(e, n) {
                    t = t + n + ":" + e + ";";
                  }),
                  t
                );
              }
              function s(e) {
                for (var t = "", n = 0; n < e.length; n++)
                  (t += e[n].selector + "{"),
                    _.each(e[n].styles, function(e, n) {
                      (t += n + ":" + e), (t += "!important;");
                    }),
                    (t += "}");
                return t;
              }
              function d(e) {
                if (e) {
                  var t = e.cloneNode(!0);
                  (t.style.height = "auto"),
                    (t.style.visibility = "hidden"),
                    document.body.appendChild(t);
                  var n = parseInt(t.getBoundingClientRect().height);
                  return dom(t).remove(), n;
                }
              }
              function u(e) {
                var t = Sizzle("[data-pendo-display-flex]", e);
                _.each(t, function(e) {
                  var t = FlexboxPolyfill.initializeFlexboxContainer(e),
                    n = e.attributes["data-pendo-justify-content"].value;
                  FlexboxPolyfill.justifyContent(t, n);
                });
              }
              function l(e) {
                var t = document.getElementById(e);
                t && BuildingBlockGuides.flexElement(t);
              }
              function c(e) {
                p(e);
                var t = getClientRect(e);
                if (0 === t.width || 0 === t.height) return !0;
                if (e.style && "visible" === e.style.visibility) return !1;
                for (
                  var n = e, i = e.id || "", r = 0;
                  0 !== i.indexOf("pendo-g-") &&
                  (p(n), (n = n.parentNode), (i = n.id || ""), r++, !(r > 10));

                );
                return !1;
              }
              function p(e) {
                return e.style && "none" === e.style.display
                  ? !0
                  : e.style && "0" === e.style.opacity
                  ? !0
                  : e.style && "hidden" === e.style.visibility
                  ? !0
                  : !1;
              }
              function f(e) {
                var t = document.getElementById(e);
                if (t) {
                  var n = d(t),
                    i = parseInt(t.style.height);
                  if (n !== i) {
                    t.style.height = "" + n + "px";
                    var r = t.attributes["data-vertical-alignment"];
                    r &&
                      "Centered" === r.value &&
                      (t.style["margin-top"] = "-" + n / 2 + "px");
                  }
                }
              }
              function h(e, t) {
                if (t(e)) return e;
                if (!e.children) return !1;
                for (var n = 0; n < e.children.length; n++) {
                  var i = h(e.children[n], t);
                  if (i) return i;
                }
                return !1;
              }
              function g(e) {
                try {
                  var t = e.attributes.blockOutUI || {};
                  t.additionalElements = t.additionalElements || "";
                  var n = [];
                  if (t.enabled && e.element !== getBody()) {
                    n.push(e.element);
                    for (
                      var i = t.additionalElements
                          .replace(/\s/g, "")
                          .split(","),
                        r = 0;
                      r < t.additionalElements.length;
                      r++
                    )
                      try {
                        var o = Sizzle(i[r]);
                        o &&
                          _.each(o, function(e) {
                            n.push(e);
                          });
                      } catch (a) {
                        log(
                          "Additional element for blockOutUI is invalid selector",
                          "error"
                        );
                      }
                  }
                  var s = v(n),
                    d = t.padding || { left: 0, right: 0, top: 0, bottom: 0 },
                    u = getClientRect(getBody());
                  s ||
                    (s = {
                      top: 0,
                      left: 0,
                      right: u.width,
                      bottom: u.height,
                      width: 0,
                      height: 0
                    }),
                    s.fixed &&
                      ((u.top = 0),
                      (u.bottom = u.height),
                      (u.left = 0),
                      (u.right = u.width));
                  var l = b(u, s, d);
                  if (
                    !hasBlockBoxChanged(s) &&
                    !hasBodyDimensionsChanged(u) &&
                    !haveScreenCoordsChanged(l) &&
                    y()
                  )
                    return;
                  var c = { "z-index": 1e4, position: "fixed" },
                    p = [];
                  return (
                    _.each(l, function(e, t) {
                      var n = m(t, _.extend({}, e, c));
                      p.push(n);
                    }),
                    w(p, e)
                  );
                } catch (a) {
                  log("Failed to add BlockOut ui", "error");
                }
              }
              function v(e) {
                if (e && e.length) {
                  var t = _.reduce(
                    e,
                    function(e, t) {
                      if (!isElementVisible(t)) return e;
                      var n = getClientRect(t);
                      if (n)
                        return (
                          (e.fixed = e.fixed && n.fixed),
                          _.each(
                            [
                              ["top", isLessThan],
                              ["right", isGreaterThan],
                              ["bottom", isGreaterThan],
                              ["left", isLessThan]
                            ],
                            function(t) {
                              var i = t[0],
                                r = t[1];
                              (!e[i] || r(n[i], e[i])) && (e[i] = n[i]);
                            }
                          ),
                          e
                        );
                    },
                    { fixed: !0 }
                  );
                  (t.height = t.bottom - t.top), (t.width = t.right - t.left);
                  var n = bodyOffset();
                  return (
                    t.fixed ||
                      ((t.left += n.left),
                      (t.right += n.left),
                      (t.top += n.top),
                      (t.bottom += n.top)),
                    (t.fixed = !!t.fixed),
                    t
                  );
                }
              }
              function m(e, t) {
                var n = dom(
                  "div._pendo-guide-backdrop-region-block_._pendo-region-" +
                    e +
                    "_"
                );
                return (
                  n.length ||
                    (n = dom(
                      '<div class="_pendo-guide-backdrop-region-block_ _pendo-region-' +
                        e +
                        '_"></div>'
                    )),
                  dom(n).css(t),
                  n
                );
              }
              function y() {
                var e = dom("._pendo-guide-backdrop_");
                return e.length > 0;
              }
              function b(e, t, n) {
                var i = {},
                  r = t.top - e.top,
                  o = t.left - e.left;
                (i.top = r - n.top),
                  (i.left = o - n.left),
                  (i.height = t.height + n.top + n.bottom),
                  (i.width = t.width + n.left + n.right);
                var a = { left: 0, top: 0 };
                return (
                  positionFixedActsLikePositionAbsolute() &&
                    ((a = bodyOffset()),
                    (i.left += documentScrollLeft()),
                    (i.top += documentScrollTop())),
                  (i.bottom = i.top + i.height),
                  (i.right = i.left + i.width),
                  {
                    top: {
                      top: 0,
                      height: Math.max(i.top - a.top, 0),
                      left: i.left,
                      width: i.width
                    },
                    right: {
                      top: -a.top,
                      bottom: 0,
                      left: i.right - a.left,
                      right: 0
                    },
                    bottom: {
                      top: i.bottom - a.top,
                      bottom: 0,
                      left: i.left - a.left,
                      width: i.width
                    },
                    left: {
                      top: -a.top,
                      bottom: 0,
                      left: -a.left,
                      width: i.left
                    }
                  }
                );
              }
              function w(e, t) {
                var n = E("pendo-backdrop", t.domJson);
                delete n.props.style.left,
                  delete n.props.style.right,
                  delete n.props.style.width,
                  delete n.props.style.height,
                  delete n.props.style.bottom,
                  delete n.props.style.top;
                var i = pendo.dom('<div class="_pendo-guide-backdrop_">');
                return (
                  i.attr("class", "_pendo-guide-backdrop_"),
                  _.each(n.props, function(t, r) {
                    _.each(e, function(e) {
                      "style" === r ? e.css(n.props.style) : e.attr(r, t),
                        i.append(e);
                    });
                  }),
                  i
                );
              }
              function E(e, t) {
                if (t.props && t.props.id === e) return t;
                if (t.children)
                  for (var n = 0; n < t.children.length; n++) {
                    var i = E(e, t.children[n]);
                    if (i) return i;
                  }
              }
              function S(e) {
                var t = g(e);
                t &&
                  (dom("._pendo-guide-backdrop_").remove(),
                  e.guideElement.append(t));
              }
              return {
                renderGuideFromJSON: t,
                buildNodeFromJSON: i,
                recalculateGuideHeightOnImgLoad: r,
                buildStyleString: a,
                buildStyleTagContent: s,
                bindActionToNode: o,
                getGuideComputedHeight: d,
                recalculateGuideHeight: f,
                findDomBlockInDomJson: h,
                isElementHiddenInGuide: c,
                flexAllThings: l,
                flexElement: u,
                updateBackdrop: S,
                buildNodesFromJSON: n,
                findGuideContainerJSON: e
              };
            })(),
            BuildingBlockResourceCenter = (function() {
              function e(e) {
                var t = _.find(e, function(e) {
                  return (
                    e &&
                    e.attributes &&
                    e.attributes.resourceCenter &&
                    e.attributes.resourceCenter.isTopLevel
                  );
                });
                if (!t) return q.resolve();
                var n = _.filter(e, function(e) {
                  return (
                    e &&
                    e.attributes &&
                    e.attributes.resourceCenter &&
                    e.attributes.resourceCenter.isModule
                  );
                });
                if (!n || !n.length)
                  return (t.hasResourceCenterContent = !1), q.resolve();
                var i = _.filter(n, function(t) {
                  var n = t.attributes.resourceCenter.children,
                    i = t.attributes.resourceCenter.moduleId;
                  if ("SandboxModule" === i) return !0;
                  var r = _.reduce(
                    n,
                    function(t, n) {
                      var i = _.find(e, function(e) {
                        return e.id === n.id;
                      });
                      return i ? t.concat(n) : t;
                    },
                    []
                  );
                  return r.length;
                });
                if (!i || !i.length)
                  return (t.hasResourceCenterContent = !1), q.resolve();
                1 === i.length &&
                  ((t.skipResourceCenterHomeView = !0),
                  (t.moduleIdToReplaceHomeViewWith = i[0].id));
                var r = _.map(i, function(e) {
                  return (
                    (e.hasResourceCenterContent = !0), e.steps[0].fetchContent()
                  );
                });
                return (t.hasResourceCenterContent = !0), q.all(r);
              }
              function t(e, t) {
                var n = "left 200ms",
                  i = "left";
                t && ((n = t[0].value), (i = t[1].value));
                var r = pendo.Sizzle("#pendo-resource-center-container")[0];
                if (r) {
                  var o = pendo.dom(r).find('[id^="pendo-g-"]')[0];
                  if (o) {
                    var a = _.find(pendo.guides, function(t) {
                        return t.id === e;
                      }),
                      s = a.steps[0];
                    s.eventRouter = new EventRouter();
                    var d = BuildingBlockGuides.buildNodeFromJSON(s.domJson, s);
                    s.guideElement = d;
                    var u = d[0];
                    return (
                      -1 === u.id.indexOf("pendo-g-") &&
                        (u = d.find('[id^="pendo-g-"]')[0]),
                      (u.style.transition = n),
                      (o.style.transition = n),
                      "left" === i
                        ? (u.style.left = r.offsetWidth + "px")
                        : "right" === i &&
                          (u.style.left = -1 * r.offsetWidth + "px"),
                      r.appendChild(u),
                      BuildingBlockGuides.flexElement(r),
                      BuildingBlockGuides.recalculateGuideHeight(s.containerId),
                      (u.style.left = "0px"),
                      "left" === i
                        ? (o.style.left = -1 * r.offsetWidth + "px")
                        : "right" === i &&
                          (o.style.left = r.offsetWidth + "px"),
                      window.setTimeout(function() {
                        o.remove();
                      }, 200),
                      s.onShown("launcher"),
                      d
                    );
                  }
                }
              }
              return {
                initializeResourceCenter: e,
                replaceResourceCenterContent: t
              };
            })(),
            BuildingBlockSvgs = (function() {
              function e(e, n) {
                switch (e) {
                  case "onboardingProgressCircle":
                    return t(n);
                }
              }
              function t(e) {
                if (isOldIE(9)) return r(e);
                var t = e.svgAttributes,
                  o = t.fillCircle.percentComplete || 0,
                  a = o >= 100;
                return a ? n(t) : i(t);
              }
              function n(e) {
                var t = e.fillCircle.stroke,
                  n =
                    '<svg xmlns="http://www.w3.org/2000/svg" class="pendo-progress-circle-fill" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
                  i = pendo.dom(n);
                return i[0].setAttributeNS(null, "stroke", t), i;
              }
              function i(e) {
                var t = e.fillCircle.stroke,
                  n = e.backgroundCircle.stroke,
                  i = e.fillCircle.percentComplete || 0,
                  r = 100 / (2 * Math.PI),
                  o =
                    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid"><circle class="pendo-progress-circle-background" cx="20" cy="20" r="' +
                    r +
                    '" stroke-width="6px" stroke-linecap="round" fill="none"></circle><circle class="pendo-progress-circle-fill" cx="20" cy="20" r="' +
                    r +
                    '" stroke-width="6px" stroke-linecap="round" transform="rotate(-90 20 20)" fill="none"></circle></svg>',
                  a = pendo.dom(o),
                  s = a.find(".pendo-progress-circle-fill")[0],
                  d = a.find(".pendo-progress-circle-background")[0];
                return (
                  d.setAttributeNS(null, "stroke", n),
                  0 >= i
                    ? s.setAttributeNS(null, "stroke-width", "0px")
                    : (s.setAttributeNS(null, "stroke", t),
                      s.setAttributeNS(null, "stroke-dasharray", i + ", 100")),
                  a
                );
              }
              function r(e) {
                var t = e.svgAttributes,
                  n = t.fillCircle.stroke,
                  i = t.backgroundCircle.stroke,
                  r = t.fillCircle.percentComplete || 0,
                  o = r >= 100,
                  a =
                    '<div class="pendo-progress-circle-ie"><div class="pendo-progress-circle-fill"></div></div>',
                  s = pendo.dom(a),
                  d = s.find(".pendo-progress-circle-fill");
                return (
                  o
                    ? d.css({
                        border: "3px solid " + n,
                        height: "10px",
                        width: "10px"
                      })
                    : d.css({
                        border: "3px solid " + i,
                        height: "10px",
                        width: "10px"
                      }),
                  s
                );
              }
              return { buildSvgNode: e, createProgressCircleSvg: t };
            })(),
            P2AutoLaunch = (function() {
              function e() {
                document.addEventListener(
                  "keyup",
                  function(e) {
                    if (
                      (e.shiftKey &&
                        e.altKey &&
                        "Digit7" === e.code &&
                        c("", !0),
                      e.shiftKey &&
                        e.altKey &&
                        "Digit8" === e.code &&
                        c("", !1, !0),
                      e.shiftKey &&
                        e.altKey &&
                        "Digit9" === e.code &&
                        pendo.designerv2.launchInAppDesigner(),
                      e.shiftKey && e.altKey && "Digit0" === e.code)
                    ) {
                      var t = prompt("Lookaside", "app-");
                      t && c(t, !1);
                    }
                  },
                  !1
                );
              }
              function t(e, t) {
                var o = {
                    "background-color": m.WHITE,
                    height: u(y.MODAL_HEIGHT),
                    "min-height": u(y.MODAL_HEIGHT),
                    width: u(y.MODAL_WIDTH),
                    position: "fixed",
                    top: u(y.MODAL_TOP_OFFSET),
                    left: "50%",
                    "margin-left": u(-y.MODAL_WIDTH / 2),
                    "border-radius": u(4),
                    "box-shadow": "0px 13px 28px rgba(0, 0, 0, 0.17)",
                    overflow: "hidden",
                    "z-index": "300000",
                    "box-sizing": "border-box"
                  },
                  a = d("div", v.container, o);
                a.appendChild(s()),
                  a.appendChild(n(t)),
                  a.appendChild(i()),
                  a.appendChild(r(e)),
                  document.body.appendChild(a);
              }
              function n(e) {
                var t = d("div", v.header, {
                    "background-color": m.GRAY_PRIMARY,
                    height: u(y.HEADER_HEIGHT),
                    "min-height": u(y.HEADER_HEIGHT),
                    width: "100%",
                    padding: u(10) + " " + u(20),
                    display: "flex",
                    "align-items": "center",
                    "box-sizing": "border-box"
                  }),
                  n = d("div", v.logoContainer, {
                    height: u(38),
                    width: u(44),
                    "background-color": m.PENDO_PINK,
                    padding: u(8),
                    "border-radius": u(3),
                    "box-sizing": "border-box"
                  });
                (n.innerHTML = b), t.appendChild(n);
                var i = d("div", v.title, {
                  width: "100%",
                  display: "flex",
                  "align-items": "center",
                  "font-family": E.PRIMARY_FONT,
                  "font-size": u(18),
                  color: m.WHITE,
                  "margin-left": u(10),
                  "box-sizing": "border-box"
                });
                return (
                  (i.innerText = e ? "VIA Designer" : "Pendo Designer"),
                  t.appendChild(i),
                  t
                );
              }
              function i() {
                var e = d("div", v.body, {
                  height: y.BODY_HEIGHT,
                  "min-height": y.BODY_HEIGHT,
                  width: "100%",
                  display: "flex",
                  padding: u(32) + " " + u(20),
                  "font-family": E.PRIMARY_FONT,
                  "font-size": u(14),
                  "box-sizing": "border-box"
                });
                return (
                  (e.innerText =
                    "Thanks for letting us know you're here. We're ready to try this again. Launch Designer below to begin."),
                  e
                );
              }
              function r(e) {
                var t = d("div", v.footer, {
                    "align-items": "center",
                    "border-top": "1px solid" + m.GRAY_LIGHTER_6,
                    display: "flex",
                    height: u(y.FOOTER_HEIGHT),
                    "justify-content": "flex-end",
                    "min-height": u(y.FOOTER_HEIGHT),
                    padding: u(10),
                    width: "100%",
                    "box-sizing": "border-box"
                  }),
                  n = d("button", v.closeButton, {
                    "border-radius": u(3),
                    border: "none",
                    height: u(y.BUTTON_HEIGHT),
                    "padding-right": u(10),
                    "padding-left": u(10),
                    "font-family": E.PRIMARY_FONT,
                    "font-size": u(14),
                    display: "flex",
                    "line-height": "120%",
                    "margin-right": u(10),
                    "min-width": "90px",
                    "justify-content": "center",
                    "box-sizing": "border-box"
                  });
                (n.innerHTML = "Close"),
                  (n.onclick = function() {
                    p(v.container), p(v.commIframeId);
                  });
                var i = d("button", v.launchButton, {
                  "background-color": m.TEAL_PRIMARY,
                  "border-radius": u(3),
                  color: m.WHITE,
                  border: "none",
                  height: u(y.BUTTON_HEIGHT),
                  "padding-right": u(10),
                  "padding-left": u(10),
                  "font-family": E.PRIMARY_FONT,
                  "font-size": u(14),
                  display: "flex",
                  "line-height": "120%",
                  "min-width": "90px",
                  "justify-content": "center",
                  "box-sizing": "border-box"
                });
                return (
                  (i.innerHTML = "Launch Designer"),
                  (i.onclick = function() {
                    g(e);
                  }),
                  t.appendChild(n),
                  t.appendChild(i),
                  t
                );
              }
              function o(e) {
                return _.reduce(
                  _.pairs(e),
                  function(e, t) {
                    var n = t[0],
                      i = t[1];
                    return e + n + ":" + i + ";";
                  },
                  ""
                );
              }
              function a(e) {
                return _.reduce(
                  _.pairs(e),
                  function(e, t) {
                    var n = t[0],
                      i = t[1];
                    return e + n + "{" + o(i) + "} ";
                  },
                  ""
                );
              }
              function s() {
                var e = document.createElement("style");
                e.setAttribute("id", v.style), (e.type = "text/css");
                var t = document.createTextNode(a(w));
                return e.appendChild(t), e;
              }
              function d(e, t, n) {
                var i = document.createElement(e);
                return i.setAttribute("id", t), _.extend(i.style, n), i;
              }
              function u(e) {
                return e + "px";
              }
              function l(e) {
                return "#" + e;
              }
              function c(e, n, i) {
                var r,
                  o,
                  a = pendo._.once(function(e) {
                    n || !i ? g(e) : t(e, n), f();
                  });
                window.addEventListener("message", function(e) {
                  if ("pendo-designer-launch-modal" === e.data.destination) {
                    if ((clearInterval(r), e.data.viaconfirmed))
                      return void clearInterval(o);
                    if (!e.data.token) return void f();
                    a(e.data.token);
                    var t = JSON.parse(e.data.token);
                    t.host &&
                      t.host.indexOf("via") &&
                      !t.visitorId &&
                      (o ||
                        (o = setInterval(function() {
                          document.getElementById(v.commIframeId) && h();
                        }, 100)));
                  }
                }),
                  pendo.designerv2.addCommunicationIframe({
                    lookasideDir: e,
                    defaultBucket: "in-app-designer"
                  }),
                  h(),
                  (r = window.setInterval(h, 50));
              }
              function p(e) {
                document.getElementById(e) &&
                  document.getElementById(e).remove();
              }
              function f() {
                var e = document.querySelector(
                  "#" + v.commIframeId + '[src*="pendo"]'
                );
                e && e.remove();
              }
              function h() {
                document
                  .getElementById(v.commIframeId)
                  .contentWindow.postMessage(
                    {
                      destination: "pendo-designer-ls",
                      source: "pendo-designer-launch-modal",
                      visitorId: window.pendo.visitorId
                    },
                    "*"
                  );
              }
              function g(e) {
                var t = {},
                  n = JSON.parse(e);
                n.host && (t.host = n.host),
                  n.lookaside && (t.lookaside = n.lookaside),
                  p(v.container),
                  pendo.designerv2.launchInAppDesigner(t);
              }
              var v = {
                  body: "pendo-launch-modal-body",
                  closeButton: "pendo-launch-modal-close-button",
                  container: "pendo-launch-modal",
                  footer: "pendo-launch-modal-footer",
                  header: "pendo-launch-modal-header",
                  launchButton: "pendo-launch-modal-launch-button",
                  title: "pendo-launch-modal-title",
                  logoContainer: "pendo-launch-modal-logo-container",
                  style: "pendo-launch-modal-style",
                  commIframeId: "pendo-designer-communication-iframe"
                },
                m = {
                  GRAY_LIGHTER_6: "#EAECF1",
                  GRAY_PRIMARY: "#2A2C35",
                  PENDO_PINK: "#FF4876",
                  TEAL_DARKER: "#036463",
                  TEAL_PRIMARY: "#008180",
                  WHITE: "#FFFFFF"
                },
                y = {
                  BUTTON_HEIGHT: 35,
                  HEADER_HEIGHT: 60,
                  MODAL_HEIGHT: 235,
                  MODAL_TOP_OFFSET: 150,
                  MODAL_WIDTH: 370
                };
              (y.FOOTER_HEIGHT = 1.25 * y.HEADER_HEIGHT),
                (y.BODY_HEIGHT =
                  "calc(100% - " +
                  u(y.HEADER_HEIGHT) +
                  " - " +
                  u(y.FOOTER_HEIGHT) +
                  ")");
              var b =
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164.12 164.12"><defs><style>.cls-1{fill:#fff;}</style></defs><title>chevron</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="cls-1" points="82.06 0 0 82.06 82.06 82.06 82.06 164.13 164.13 82.06 164.13 0 82.06 0"/></g></g></svg>',
                w = {};
              (w[l(v.closeButton) + ":hover"] = {
                "background-color": m.GRAY_LIGHTER_6
              }),
                (w[l(v.launchButton) + ":hover"] = {
                  "background-color": m.TEAL_DARKER + " !important"
                });
              var E = { PRIMARY_FONT: "Helvetica Neue" };
              return {
                listen: e,
                launchOnLocalStorageToken: g,
                ids: v,
                removeElement: p,
                attemptToLaunch: c
              };
            })(),
            DesignerV2 = (function() {
              function e(e) {
                return e
                  ? /^https:\/\/\w+\.pendo\.io$/.test(e) ||
                      /^https:\/\/([a-zA-Z0-9-]+\.)?pendo-dev\.com$/.test(e) ||
                      /^https:\/\/([a-zA-Z0-9-]+-dot-)?pendo-(dev|test|io|batman|magic|atlas)\.appspot\.com$/.test(
                        e
                      ) ||
                      /^https:\/\/via\.pendo\.local:\d{4}$/.test(e)
                  : !0;
              }
              function t(t) {
                if (!v()) {
                  var r = /pendo-designer=([A-Za-z0-9-]+)/,
                    o = /lookaside=[A-Za-z0-9-]+/;
                  if (r.test(t)) {
                    var a = r.exec(t);
                    if (a) {
                      var s = a[0],
                        d = o.exec(t),
                        u = d ? d[0] : "",
                        l = n(a[1]),
                        c = queryStringToObject(s + "&" + u),
                        p = e(l.host) ? l.host : null;
                      return c.hasOwnProperty("pendo-designer")
                        ? (i({
                            lookaside: c.lookaside,
                            host: p,
                            preloader: !1
                          }),
                          !0)
                        : void 0;
                    }
                  }
                }
              }
              function n(e) {
                try {
                  return JSON.parse(atob(decodeURIComponent(e))) || {};
                } catch (t) {
                  return {};
                }
              }
              function i(e) {
                (pendo.designerEnabled = !0),
                  e || (e = {}),
                  e.lookaside ||
                    (e.lookaside =
                      pendoLocalStorage.getItem("pendo-designer-lookaside") ||
                      "");
                var t = e.host || b,
                  n = e.gcsBucket || "in-app-designer",
                  i = e.lookaside || "latest",
                  r = e.preloader ? "preloader.js" : "plugin.js",
                  o = e.preloader ? "preloader-shims" : "designer-shims",
                  a = t + "/" + n + "/" + i + "/" + r;
                window.pendo.designerv2.hostConfig = {
                  gcsBucket: n,
                  baseFolder: i,
                  lookaside: e.lookaside,
                  uniqueWindowId: e.uniqueWindowId,
                  host: t
                };
                var s = {};
                e.selectionOnly && (s["selection-only"] = !0), f(o, a, s);
              }
              function r() {
                var e =
                    "@keyframes pendoExtensionSlideIn{from{transform:translate3d(-300px,0,0)}to{transform:translate3d(0,0,0);}}",
                  t =
                    "#pendo-draggable-handle{z-index:11;line-height: 15px;text-align:center;font-size:20px;letter-spacing:1.5px;position:absolute;width:100%;height:65px;font-size:16px;background-color:transparent;color:#ABE7DB;user-select:none;cursor: move;cursor: grab;cursor: -moz-grab;cursor: -webkit-grab;}#pendo-draggable-handle:active{cursor: grabbing;cursor: -moz-grabbing;cursor: -webkit-grabbing !important;}#pendo-draggable-handle.hidden{display:none;}#pendo-draggable-handle:hover{color:#2EA2A0;}",
                  n =
                    "#pendo-mousemove-cover{position:absolute;height:100%;width:100%;top:0;left:0;z-index:9999999999;display:none;}",
                  i =
                    "#pendo-designer-container{animation-duration:375ms;animation-name:pendoExtensionSlideIn;animation-timing-function:cubic-bezier(0.4,0.0,0.2,1); box-shadow: 0px 2px 10px rgba(0,0,0,0.15);height:100vh;width:400px;position:fixed;top:0;left:0;overflow:hidden;border-radius:3px;z-index:1000000;}",
                  r =
                    "#pendo-designer-container.fullscreen{width:100%;opacity:0.98;}",
                  o = "#pendo-designer-container.closed{left:-400px;}",
                  a =
                    "#pendo-designer-iframe{background:#3a3c45;border:0px;height:100%;left:0;z-index:10;top:0;width:100%;}";
                return e + t + i + n + r + o + a;
              }
              function o(e) {
                e || (e = {});
                var t = e.lookaside || "latest",
                  n = e.gcsBucket || "designer";
                p("designer-styles", r(t));
                var i = b + "/" + n + "/" + t + "/plugin.js";
                f("designer-shims", i);
                var o = a(e, t, n);
                if ((o && u(o), window.pendo.DESIGNER_VERSION))
                  return void s(t, e);
                var d = window.setInterval(function() {
                  window.pendo.DESIGNER_VERSION && (s(t, e), clearInterval(d));
                }, 100);
              }
              function a(e) {
                e || (e = {});
                var t = e.lookaside || e.lookasideDir || "latest",
                  n = e.gcsBucket || e.defaultBucket || "designer",
                  i = new Date().getTime();
                window.pendo.designerv2.windowCommunicationId = i;
                var r = "pendo-designer-communication-iframe";
                if (!document.getElementById(r)) {
                  var o = "pendo-designer-communication-embedded",
                    a = "communication.html";
                  (o += "__" + i),
                    e &&
                      e.lookaside &&
                      ((o += "__" + e.lookaside), (a = "lookaside-" + a));
                  var s = b + "/" + n + "/" + t + "/" + a,
                    d = l(r, s, "border-width:0;height:0;width:0;");
                  return (
                    d.setAttribute("name", o), document.body.appendChild(d), d
                  );
                }
                return document.getElementById(r);
              }
              function s(e, t) {
                h(), d(e, t);
              }
              function d(e, t) {
                if (!document.getElementById("pendo-designer-container")) {
                  var n = "pendo-designer-embedded",
                    i = "designer.html",
                    r = "designer";
                  (n += "__" + window.pendo.designerv2.windowCommunicationId),
                    t &&
                      t.lookaside &&
                      ((n += "__" + t.lookaside), (i = "lookaside.html")),
                    t && t.gcsBucket && (r = t.gcsBucket);
                  var o = b + "/" + r + "/" + e + "/" + i,
                    a = l("pendo-designer-iframe", o);
                  a.setAttribute("name", n);
                  var s = c(a);
                  document.body.appendChild(s);
                }
              }
              function u(e) {
                window.addEventListener("message", function(t) {
                  "pendo-designer" === t.data.destination &&
                    e.contentWindow.postMessage(t.data, "*");
                }),
                  window.addEventListener("keyup", function(t) {
                    27 === t.keyCode &&
                      e.contentWindow.postMessage(
                        { type: "escape", destination: "pendo-designer" },
                        "*"
                      );
                  });
              }
              function l(e, t, n) {
                var i = document.createElement("iframe");
                return (
                  i.setAttribute("id", e),
                  n && i.setAttribute("style", n),
                  i.setAttribute(
                    "sandbox",
                    "allow-scripts allow-same-origin allow-top-navigation allow-forms allow-pointer-lock allow-popups"
                  ),
                  (i.src = t),
                  i
                );
              }
              function c(e) {
                var t = document.createElement("div");
                return (
                  t.setAttribute("id", "pendo-designer-container"),
                  t.appendChild(e),
                  t
                );
              }
              function p(e, t) {
                if (!document.getElementById(e)) {
                  var n = document.createElement("style");
                  n.setAttribute("id", e), (n.type = "text/css");
                  var i = document.createTextNode(t);
                  n.appendChild(i),
                    document.getElementsByTagName("head")[0].appendChild(n);
                }
              }
              function f(e, t, n) {
                if (!document.getElementById(e)) {
                  var i = document.createElement("script");
                  i.setAttribute("charset", "utf-8"),
                    i.setAttribute("id", e),
                    (i.src = t),
                    n &&
                      _.forEach(n, function(e, t) {
                        i.setAttribute(t, e);
                      }),
                    document.body.appendChild(i);
                }
              }
              function h() {
                window.postMessage(
                  {
                    type: "connect",
                    source: "pendo-designer-content-script",
                    destination: "pendo-designer-agent"
                  },
                  "*"
                );
              }
              function g(e) {
                var t = document.getElementById(
                  "pendo-designer-communication-iframe"
                );
                t && t.contentWindow.postMessage(e.data, "*");
              }
              function v() {
                return /^pendo/.test(window.name);
              }
              function m() {
                window.addEventListener("message", y);
              }
              function y(e) {
                if (e && e.data) {
                  var t = e.data.destination;
                  if (t && "pendo-designer-agent" === t) {
                    var n = e.data.type;
                    if (n && "addSelectionCode" === n) {
                      var r = e.data.options;
                      r &&
                        ((r.selectionOnly = !0),
                        i(r),
                        window.removeEventListener("message", y));
                    }
                  }
                }
              }
              var b = "https://app.pendo.io";
              return (
                m(),
                {
                  launchDesigner: o,
                  launchInAppDesigner: i,
                  launchOnToken: t,
                  sendMessageToLocalStorage: g,
                  isValidDesignerHost: e,
                  addCommunicationIframe: a
                }
              );
            })();
          (pendo.designerv2 = DesignerV2),
            (pendo.P2AutoLaunch = P2AutoLaunch),
            (pendo.BuildingBlocks = {
              BuildingBlockGuides: BuildingBlockGuides,
              BuildingBlockResourceCenter: BuildingBlockResourceCenter,
              BuildingBlockTemplates: BuildingBlockTemplates,
              BuildingBlockTooltips: BuildingBlockTooltips,
              BuildingBlockSvgs: BuildingBlockSvgs
            }),
            (pendo.getVersion = getVersion),
            (pendo.isReady = isReady),
            (pendo.pageLoad = pageLoad),
            (pendo.getVisitorId = pendo.get_visitor_id),
            (pendo.getAccountId = pendo.get_account_id),
            (pendo.flushNow = function() {
              return flushNow(!0);
            }),
            (pendo.initGuides = initGuides),
            (pendo.loadGuides = loadGuides),
            (pendo.findGuideByName = findGuideByName),
            (pendo.hideGuides = hideGuides),
            (pendo.onGuideDismissed = onGuideDismissed),
            (pendo.onGuideAdvanced = onGuideAdvanced),
            (pendo.onGuidePrevious = onGuidePrevious),
            (pendo.startGuides = manuallyStartGuides),
            (pendo.stopGuides = stopGuides),
            (pendo.toggleLauncher = toggleLauncher),
            (pendo.showLauncher = expandLauncherList),
            (pendo.hideLauncher = collapseLauncherList),
            (pendo.removeLauncher = removeLauncher),
            (pendo.defaultCssUrl = getDefaultCssUrl()),
            (pendo.areGuidesDisabled = areGuidesDisabled),
            (pendo.setGuidesDisabled = setGuidesDisabled),
            (pendo.buildNodeFromJSON = BuildingBlockGuides.buildNodeFromJSON),
            (pendo.flexElement = BuildingBlockGuides.flexElement),
            (pendo.GuideFactory = GuideFactory),
            (pendo.dom = dom),
            (pendo.log = log),
            (pendo.enableLogging = enableLogging),
            (pendo.disableLogging = disableLogging),
            (pendo.setActiveContexts = setActiveContexts),
            (pendo.showLogHistory = showLogHistory),
            (pendo.getLoggedContexts = getLoggedContexts),
            (pendo.isDebuggingEnabled = isDebuggingEnabled),
            (pendo.enableDebugging = enableDebugging),
            (pendo.disableDebugging = disableDebugging);
          var designer = {
              dom: dom,
              placeBadge: placeBadge,
              showPreview: showPreview,
              stopGuides: stopGuides,
              removeAllBadges: removeAllBadges,
              _: _,
              sizzle: Sizzle,
              tellMaster: tellMaster,
              tell: tellMaster,
              log: log,
              attachEvent: attachEvent,
              createLauncher: createLauncher,
              removeLauncher: removeLauncher,
              addGuideToLauncher: addGuideToLauncher,
              updateLauncherContent: updateLauncherContent,
              DEFAULT_TIMER_LENGTH: DEFAULT_TIMER_LENGTH,
              getOffsetPosition: getOffsetPosition,
              getScreenDimensions: getScreenDimensions,
              registerMessageHandler: registerMessageHandler,
              whenLoadedCall: whenLoadedCall,
              loadResource: pendo.loadResource,
              loadGuideCss: loadGuideCss,
              GuideFactory: GuideFactory,
              GuideStep: GuideStep,
              extractElementTreeContext: extractElementTreeContext,
              previewGuideFromJSON: BuildingBlockGuides.previewGuideFromJSON,
              hidePreviewedGuide: BuildingBlockGuides.hidePreviewedGuide
            },
            addDesignerFunctionality = function() {
              (designer.areGuidesEnabled = !areGuidesDisabled()),
                pendo.designer || (pendo.designer = designer);
            },
            removeDesignerFunctionality = function() {
              pendo.designer &&
                ((pendo.designer = null), delete pendo.designer);
            };
          isPrototypeOlderThan(1.7) && patchJSONstringify(),
            (pendo.track = track);
          var ExtensionService = {};
          !(function(e) {
            function t(e) {
              if (!e.length) return e;
              var n = _.filter(e, o);
              return n.length ? t(_.difference(e, n)) : e;
            }
            function n(e) {
              var t = ["name", "version", "use", "type", "uri"];
              if (!_.every(t, _.partial(_.has, e))) return !1;
              var n = r(e.use);
              return _.every(
                _.map(n, function(t) {
                  return t(e);
                })
              );
            }
            function i(e) {
              return d[e] ? d[e].handler || _.identity : null;
            }
            function r(e) {
              return d[e] ? d[e].validators : [];
            }
            function o(t) {
              if ("behavior" === t.use) {
                var n = t.uri(e, ExtensionAPI);
                return n ? (s.push(t), !0) : !1;
              }
              var r = i(t.use);
              if (!r) return !1;
              var o = r(t);
              return o && s.push(o), !!o;
            }
            var a = [],
              s = [],
              d = {};
            (pendo.addExtension = function(e) {
              e = [].concat(e);
              var i = _.filter(e, n);
              i.length && (a = t(a.concat(i)));
            }),
              (e.tagExtension = function(t, n) {
                var i = e.findExtensionByName(t);
                i.tags = [].concat(i.tags || [], n);
              }),
              (e.findExtensionByTag = function(e) {
                return _.find(s, function(t) {
                  return _.contains(t.tags, e);
                });
              }),
              (e.findExtensionByName = function(e) {
                return _.findWhere(s, { name: e });
              }),
              (e.filterExtensionsByUse = function(e) {
                return _.filter(s, function(t) {
                  return t.use === e;
                });
              }),
              (e.registerExtensionsByUse = function(e, t, n) {
                (n = n ? [].concat(n) : []),
                  (d[e] = { handler: t, validators: n });
              });
          })(ExtensionService);
          var ExtensionAPI = {
            Launcher: {
              addBehavior: function(e) {
                Launcher.behaviors.push(e);
              }
            },
            Metadata: {
              getMetadata: function() {
                return getMetadata();
              }
            },
            Util: {
              documentScrollTop: documentScrollTop,
              documentScrollLeft: documentScrollLeft,
              getOffsetPosition: getOffsetPosition
            }
          };
          _.each(["identify", "updateOptions", "pageLoad"], function(e) {
            var t = pendo[e];
            pendo[e] = function() {
              try {
                if (isReady()) t.apply(this, arguments);
                else {
                  var n = (pendo._q = pendo._q || []);
                  n.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                }
              } catch (i) {
                writeException(i);
              }
            };
          }),
            whenLoadedCall(autoInitialize);
        }
      })(),
      pendo.defaultLauncher(
        '<div class="_pendo-launcher-content_" style="border-color:<%= data.color %>">\n    <div class="_pendo-launcher-header_">\n        <img src="<%= data.launcherBadgeUrl %>"/>\n        <div class="_pendo-launcher-title_"><%= data.title %></div>\n        <% if (data.enableSearch) { %>\n        <div class="_pendo-launcher-search-box_">\n        <input type="text" placeholder="Type here to start looking..." />\n        </div>\n        <% } %>\n    </div>\n    <div class="_pendo-launcher-guide-listing_">\n    <% pendo._.each(guides, function(guide) { %>\n        <div class="_pendo-launcher-item_" id="launcher-<%= guide.id %>">\n            <a href="javascript:void(0);"><%= guide.name %></a>\n        </div>\n    <% }) %>\n    </div>\n    <% if (hidePoweredBy) { %>\n    <div class="_pendo-launcher-footer_"></div>\n    <% } else { %>\n    <div class="_pendo-launcher-footer_ _pendo-launcher-footer-credits_">\n        <span>powered by pendo</span>\n    </div>\n    <% } %>\n</div>\n',
        function(obj) {
          obj || (obj = {});
          var __t,
            __p = "";
          Array.prototype.join;
          with (obj)
            (__p +=
              '<div class="_pendo-launcher-content_" style="border-color:' +
              (null == (__t = data.color) ? "" : __t) +
              '">\n    <div class="_pendo-launcher-header_">\n        <img src="' +
              (null == (__t = data.launcherBadgeUrl) ? "" : __t) +
              '"/>\n        <div class="_pendo-launcher-title_">' +
              (null == (__t = data.title) ? "" : __t) +
              "</div>\n        "),
              data.enableSearch &&
                (__p +=
                  '\n        <div class="_pendo-launcher-search-box_">\n        <input type="text" placeholder="Type here to start looking..." />\n        </div>\n        '),
              (__p +=
                '\n    </div>\n    <div class="_pendo-launcher-guide-listing_">\n    '),
              pendo._.each(guides, function(e) {
                __p +=
                  '\n        <div class="_pendo-launcher-item_" id="launcher-' +
                  (null == (__t = e.id) ? "" : __t) +
                  '">\n            <a href="javascript:void(0);">' +
                  (null == (__t = e.name) ? "" : __t) +
                  "</a>\n        </div>\n    ";
              }),
              (__p += "\n    </div>\n    "),
              (__p += hidePoweredBy
                ? '\n    <div class="_pendo-launcher-footer_"></div>\n    '
                : '\n    <div class="_pendo-launcher-footer_ _pendo-launcher-footer-credits_">\n        <span>powered by pendo</span>\n    </div>\n    '),
              (__p += "\n</div>\n");
          return __p;
        }
      ));
  })(window, document);
})({
  stagingServers: [
    "geneva-dev.1m-dev.aws.oath.cloud",
    "geneva-qa.1m-dev.aws.oath.cloud",
    "nexage-dev.demohoster.com",
    "nexage-qa.demohoster.com"
  ],
  stagingAgentUrl:
    "https://pendo-io-static.storage.googleapis.com/agent/static/c2f0ea9f-ebdb-47e3-5e20-25fd80f6e8ef/pendo-staging.js",

  disableDesignerKeyboardShortcut: false,
  excludeAllText: false,
  freeNPSData: false,
  xhrTimings: false,
  xhrWhitelist: null,
  htmlAttributeBlacklist: null,
  htmlAttributes: /^(tabindex)$/i,
  apiKey: "c2f0ea9f-ebdb-47e3-5e20-25fd80f6e8ef"
});
