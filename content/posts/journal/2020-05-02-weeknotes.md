---
title: Weeknotes 18
---
- This week I pushed my little website a step further by enhancing the service worker to [pre-cache](/2020-05-01-google-webfonts-helper) selected pages and by runtime-caching images as well as all visited pages.
	This improves speed for image rendering drastically and allows to access the cached pages even offline. Voilà.
- I´m using the media-query [any-pointer: coarse](https://medium.com/@ferie/detect-a-touch-device-with-only-css-9f8e30fa1134) to increase line-height of navigation items on touch devices!
- Geoff Graham´s "[There’s an input attribute for a one-time code](https://geoffgraham.me/theres-an-input-attribute-for-a-one-time-code/)" pointed me towards the HTML <code>&lt;input type="number" autocomplete="one-time-code" /></code>, which helps to move a two factor authentication code easily into the input field. While researching the topic, I found the <code>autocomplete</code> tag can have [plenty of values](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)! Also, I found "[HTML attributes to improve your users' two factor authentication experience](https://www.twilio.com/blog/html-attributes-two-factor-authentication-autocomplete)" by Phil Nash beneficial. There is an in-depth [CSS-Tricks article by Alex Holachek](https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/), as well as a  [simulator made by Alex](https://better-mobile-inputs.netlify.app). 
- Chris Coyier writes about [automating VS Code workflows](https://css-tricks.com/some-little-improvements-to-my-vs-code-workflow-workspaces-icons-tasks/).
- Liquid variables can be accessed inside of JavaScript. E.g, the following code, which results in an array of JSON objects, is valid. It would also be valid to put the curly-braces expression into quotes.: 

	~~~
	{% raw %}var imageData = [{{imageData | compact | join: "," }}];{% endraw %}
	~~~

Interesting website links:

- [Plane Trails](https://codepen.io/chrisgannon/full/VwwRGQG)
- [Robb Owen](https://robbowen.digital)
- [Adam Silver](https://adamsilver.io)
- [Tornis](https://tornis.robbowen.digital)
- [No Style Design System](https://nostyle.herokuapp.com)

