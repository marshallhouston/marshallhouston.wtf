(function () {
  'use strict';

  const CONTENT_SELECTOR = '.page__content.e-content';
  const TITLE_SELECTOR = '#page-title';
  const RELATED_TITLE_SELECTOR = '.page__related-title';
  const ARCHIVE_TITLE_SELECTOR = '.archive__item-title';
  const SKIP_TAGS = new Set(['CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA']);
  const SESSION_KEY = 'capitalize-preference';
  let properNouns = [];
  let originalTexts = new Map();
  let isCapitalized = false;
  var toggleButtons = [];

  function init(nouns) {
    properNouns = nouns || [];
    injectInlineToggle();
    setupToggles();
    if (sessionStorage.getItem(SESSION_KEY) === 'capitalized') {
      applyCapitalization();
      toggleButtons.forEach(updateButtonLabel);
    }
  }

  function injectInlineToggle() {
    var readtimes = document.querySelectorAll('.page__meta .page__meta-readtime');
    readtimes.forEach(function (readtime) {
      var btn = document.createElement('button');
      btn.className = 'capitalize-toggle capitalize-toggle--inline';
      btn.type = 'button';
      btn.textContent = 'Aa';
      btn.setAttribute('data-tooltip', 'switch to standard capitalization');
      btn.setAttribute('aria-label', 'switch to standard capitalization');
      readtime.parentElement.appendChild(btn);
    });
  }

  function setupToggles() {
    toggleButtons = Array.from(document.querySelectorAll('.capitalize-toggle'));
    toggleButtons.forEach(function (btn) {
      updateButtonLabel(btn);
      btn.addEventListener('click', function () {
        if (isCapitalized) {
          revertCapitalization();
        } else {
          applyCapitalization();
        }
        toggleButtons.forEach(updateButtonLabel);
      });
    });
  }

  function updateButtonLabel(btn) {
    var label = isCapitalized ? 'switch to lowerchaos' : 'switch to standard capitalization';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-tooltip', label);
  }

  // selectors for elements that get title-cased (short labels, names, nav)
  var TITLECASE_SELECTORS = [
    TITLE_SELECTOR,
    RELATED_TITLE_SELECTOR,
    ARCHIVE_TITLE_SELECTOR,
    '.archive__subtitle',
    '.site-title',
    '.author__name',
    '.masthead__menu-item a',
    '.author__urls a .label',
    '.tag-cloud .tag-link',
    '.pagination--pager'
  ];

  // selectors for elements that get sentence-cased (longer prose)
  var SENTENCECASE_SELECTORS = [
    '.author__bio',
    '.archive__item-excerpt'
  ];

  function applyCapitalization() {
    // main post/page content
    var content = document.querySelector(CONTENT_SELECTOR);
    if (content) {
      capitalizeContainer(content);
    }

    // title-case elements (nav, names, headings)
    TITLECASE_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        capitalizeHeadingElement(el);
      });
    });

    // sentence-case elements (bio, descriptions)
    SENTENCECASE_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        capitalizeProseElement(el);
      });
    });

    isCapitalized = true;
    sessionStorage.setItem(SESSION_KEY, 'capitalized');
  }

  function capitalizeProseElement(el) {
    var walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (isInsideSkipTag(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    var textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    textNodes.forEach(function (node) {
      capitalizeTextNode(node, false);
    });
  }

  function revertCapitalization() {
    originalTexts.forEach(function (original, node) {
      node.textContent = original;
    });
    originalTexts.clear();
    isCapitalized = false;
    sessionStorage.removeItem(SESSION_KEY);
  }

  function capitalizeContainer(container) {
    var walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (isInsideSkipTag(node) || isInsideBlockquote(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    var textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function (node) {
      var isHeading = isInsideHeading(node);
      capitalizeTextNode(node, isHeading);
    });
  }

  function capitalizeHeadingElement(el) {
    var walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (isInsideSkipTag(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    var textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    textNodes.forEach(function (node) {
      capitalizeTextNode(node, true);
    });
  }

  function capitalizeTextNode(node, isHeading) {
    var original = node.textContent;
    if (!original || !original.trim()) return;

    originalTexts.set(node, original);

    var text = original;
    if (isHeading) {
      text = toTitleCase(text);
    } else {
      text = toSentenceCase(text, isFirstTextInBlock(node));
    }
    text = fixStandaloneI(text);
    text = applyProperNouns(text);

    node.textContent = text;
  }

  function toSentenceCase(text, capitalizeFirst) {
    if (capitalizeFirst) {
      text = text.replace(/^(\s*)([a-z])/, function (m, space, ch) {
        return space + ch.toUpperCase();
      });
    }
    text = text.replace(/([.!?][\s]+)([a-z])/g, function (m, punct, ch) {
      return punct + ch.toUpperCase();
    });
    return text;
  }

  function isFirstTextInBlock(node) {
    var blockTags = new Set(['P', 'LI', 'DIV', 'TD', 'TH', 'DD', 'DT', 'FIGCAPTION', 'SECTION', 'ARTICLE']);
    var el = node.parentElement;
    while (el) {
      if (blockTags.has(el.tagName)) {
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
        var first = walker.nextNode();
        while (first && !first.textContent.trim()) {
          first = walker.nextNode();
        }
        return first === node;
      }
      el = el.parentElement;
    }
    return true;
  }

  function toTitleCase(text) {
    var smallWords = new Set([
      'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor',
      'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as', 'is',
      'it', 'if', 'vs'
    ]);
    return text.replace(/\S+/g, function (word, index) {
      if (index === 0 || !smallWords.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
  }

  function fixStandaloneI(text) {
    return text.replace(/\bi\b(?!['-])/g, 'I');
  }

  function applyProperNouns(text) {
    properNouns.forEach(function (noun) {
      var pattern = new RegExp('\\b' + escapeRegex(noun.name) + '\\b', 'gi');
      text = text.replace(pattern, noun.capitalized);
    });
    return text;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function isInsideSkipTag(node) {
    var el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      el = el.parentElement;
    }
    return false;
  }

  function isInsideBlockquote(node) {
    var el = node.parentElement;
    while (el) {
      if (el.tagName === 'BLOCKQUOTE') return true;
      el = el.parentElement;
    }
    return false;
  }

  function isInsideHeading(node) {
    var el = node.parentElement;
    while (el) {
      if (/^H[1-6]$/.test(el.tagName)) return true;
      el = el.parentElement;
    }
    return false;
  }

  window.CapitalizeToggle = { init: init };
})();
