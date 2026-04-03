---
permalink: /kernels/
title: "kernels"
---

one-sentence ideas. seeds that might become something.

{% assign kernels = site.kernels | sort: "date" | reverse %}
{% assign current_month = "" %}
{% for kernel in kernels %}{% assign month = kernel.date | date: "%B %Y" | downcase %}{% if month != current_month %}{% assign current_month = month %}

### {{ current_month }}

{% endif %}- {{ kernel.idea }}{% if kernel.sprouted %} &rarr; [{{ kernel.post_title }}]({{ kernel.post_url }}){% endif %}
{% endfor %}
