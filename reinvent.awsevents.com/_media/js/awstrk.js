            var AWS = AWS ||
            {};
            AWS.getQueryStringValue = function()
            {
                var e, t, n, r, i, s, o = {};
                try
                {
                    e = window.location.search.substr(1);
                    e === "" ? i = [] : i = e.split("&")
                }
                catch (u)
                {
                    i = []
                }
                for (var a = 0; a < i.length; a++)
                {
                    t = i[a];
                    if (t === "") continue;
                    n = t.indexOf("=");
                    if (n < 0)
                    {
                        o[t] = "";
                        continue
                    }
                    r = t.substr(0, n);
                    if (r === "") continue;
                    s = t.substr(n + 1);
                    o[r] = decodeURIComponent(s.replace(/\+/g, " "))
                }
                return function(e)
                {
                    return o[e]
                }
            }();
            var campaignToken, referUrl, cToken, thisUrl = document.URL.split("/")[2];
            AWS.getQueryStringValue("trk") ? campaignToken = AWS.getQueryStringValue("trk") : AWS.getQueryStringValue("TRK") && (campaignToken = AWS.getQueryStringValue("TRK"));
            campaignToken && (campaignToken = campaignToken.match(/^[a-zA-Z0-9_-]{1,50}$/));
            if (campaignToken == undefined)
            {
                referUrl = document.referrer.split("/")[2];
                if (referUrl == undefined) campaignToken = "typed_bookmarked";
                else if (referUrl !== thisUrl) campaignToken = referUrl
            }
            cookieName = "cuTracker", cookieValue = "";
            cookieValue = $.cookie(cookieName);

            function initTrk() {

            if (campaignToken)
            {
                if (cookieValue)
                {
                    if (cookieValue.indexOf(",") < 0) cookieValue = cookieValue;
                    tokenHold = cookieValue.split(",");
                    tokenHold[1] = campaignToken;
                    cToken = tokenHold[0] + "," + tokenHold[1]
                }
                else cToken = campaignToken;
                $.cookie(cookieName, cToken,
                {
                    expires: new Date(2016, 12, 31),
                    path: "/"
                });
                $(".trk-referral").append($('<input type="hidden">').attr(
                {
                    value: cToken,
                    name: "00N500000026nJd"
                }));
                $("a.trkAnchor").attr("href", function(i, val)
                {
                    return val + "?trk=" + cToken
                });
                $("li.nav-item-register > a").attr("href", function(i, val)
                {
                    return val + "?trk=" + cToken
                });
            }
            else
            {
                $(".trk-referral").append($('<input type="hidden">').attr(
                {
                    value: cookieValue,
                    name: "00N500000026nJd"
                }));
                $("a.trkAnchor").attr("href", function(i, val)
                {
                    return val + "?trk=" + cookieValue
                });
                $("li.nav-item-register > a").attr("href", function(i, val)
                {
                    return val + "?trk=" + cookieValue
                });
            }
        }
        $(document).ready(function() {
            initTrk();
        });