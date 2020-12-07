---
title: Split a figure
abstract: A responsive technique of splitting a figure equally into an image (one half of the available space), and the corresponding caption (other half of the available space).
---
[[toc]]

## Rapha is the poster child

Every now and then the folks at Rapha are splitting a figure equally into an image (e.g. left half of the available space), and the corresponding caption (e.g. right half). This can be seen for example in "[Riding the Pendulum](https://www.rapha.cc/de/de/stories/riding-the-pendulum)." I think the layout is emphasizing the image and I enjoy the appearence very much. 

## Split figures example

To make the HTML of Rapha´s approach more semantic – while keeping it responsive – I´ve come up with a simplified approach that´s relying on the `<figure>` and `<figcaption>` tags in conjunction with CSS `grid`. 

In the below example, the first two figures use the split technique. Each image will only take half of the available space and the caption of the image will take the other half. The next two images take each half of the available space with a below caption. The fifth figure is not using the split technique –  the image will always occupy the entire available space. 

<figure class="split">
<img src="/img/IMG_1329.jpg" alt="">
<figcaption>A beautiful day with Emil at the Paderborn Fishponds.</figcaption>
</figure>

<figure class="split">
<figcaption>The Fishponds are a home for many waterbirds.</figcaption>
<img src="/img/IMG_1331.jpg" alt="">
</figure>

<figure class="split">
<figure>
<img src="/img/IMG_1298.jpg" alt="">
<figcaption>Emil´s hand with a Paderstone that has a sheep (or a dog) drawn on it.</figcaption>
</figure>
<figure>
<img src="/img/IMG_1297.jpg" alt="">
<figcaption>Emil´s hand presenting a Paderstone with a smiling red face drawn on it.</figcaption>
</figure>
</figure>

<figure>
<img class="w-100" src="/img/IMG_1286.jpg" alt="">
<figcaption>Sunset at the the Fishponds.</figcaption>
</figure>

## The code based on flex-box

The split is built around the `<figure>` tag, and the CSS for the split will only become active at a screen width of at least 700px. Up to that point you have pretty normal `<figure>` and `<figcaption>` behavior (depending on your CSS).

My first attempt to solve the problem was with `flex`. I do not recommend this one. I only keep it here to make my thought-process visible. My suggestion is to use the `grid`-based approach further below!

<figure>
<figcaption>CSS</figcaption>
{% highlight css %}
img {
  max-width: 100%; /*Make images responsive.*/
}

figcaption { 
  /*This figcaption style is used*/
  /*when the figcaption is preceeding other content.*/
  margin-top: 0;
  margin-bottom: 0.81rem;
}

figure>*+figcaption { 
  /*This figcaption style is used*/
  /*when the figcaption is following other content.*/
  margin-top: 0.81rem;
  margin-bottom: 0;
}
	
.w-100 {
  /*Utility class to assign 100% width to any item.*/
  /*It is not required by the split.*/
  width: 100%;
}
	
/*Split with flex*/
@media screen and (min-width: 700px) {
  figure.split {
    /*We use flex-box to split the contents and align.*/
    /*Depending on the order of the figcaption (preceeding, following)*/ 
    /*it will be positioned to the left (preceeding) or to the right (following).*/
    display: flex; 
  }
	
  figure.split>* {
    flex: 1 1 50%; /*Grow and shrink equally, use 50% of width.*/
    /*Refer to https://css-tricks.com/almanac/properties/f/flex-shrink/*/
  }

  figure.split>figcaption {
    margin: auto 0; /*center the figcaption vertically, thanks to flex-box*/
    padding: 0 1.62rem; /*have padding to the left and to the right*/   
    
    /*have a little sticky-icing, not required*/
    position: sticky; 
    top: 0;      
  }
}
{% endhighlight %}
</figure>

<figure>
<figcaption>HTML</figcaption>
{% highlight html %}
<figure class="split">
  <div> <!--The image MUST be wrapped in a div for the split to work properly-->
    <img src="/img/IMG_1329.jpg" alt="">
  </div>
  <figcaption>A beautiful day with Emil at the Paderborn Fishponds.</figcaption>
</figure>

<figure class="split">
  <figcaption>The Fishponds are a home for many waterbirds.</figcaption>
  <div> <!--The image MUST be wrapped in a div for the split to work properly-->
    <img src="/img/IMG_1331.jpg" alt="">
  </div>
</figure>

<figure>
  <!--Plain old figure. Wrapping the image into a div is not neccessary!-->
  <!--I´m only giving the image a 100% width to ensure it takes all the space-->
  <img class="w-100" src="/img/IMG_1286.jpg" alt="">
  <figcaption>Sunset at the the Fishponds.</figcaption>
</figure>
{% endhighlight %}
</figure>

The flex-box attempt turned out to be limited. The `gap` property cannot be used, because it´s currently only supported by Firefox and Chrome. Therefore padding has to be used for the figcaption, which again makes the solution less versatile. Say, if you wanted to have a `<figure>` with two split images inside, instead of an image and a `<figcaption>`, that wouldn´t be possible with the above `flex` approach. 

Also, adding a `<div>` to get proper image formatting is not my cup of tea.

## The code based on grid

The `grid`-based CSS code is shorter and more versatile in my view. It´s possible to use `column-gap` and `row-gap` and also splitting a `<figure>` into two images is possible. Artificial `<div>` elements are not needed at all. 

<figure>
<figcaption>CSS</figcaption>
{% highlight css %}
img {
  max-width: 100%; /*Make images responsive.*/
}

figcaption { 
  /*This figcaption style is used*/
  /*when the figcaption is preceeding other content.*/
  margin-top: 0;
  margin-bottom: 0.81rem;
}

figure>*+figcaption { 
  /*This figcaption style is used*/
  /*when the figcaption is following other content.*/
  margin-top: 0.81rem;
  margin-bottom: 0;
}
	
.w-100 {
  /*Utility class to assign 100% width to any item.*/
  /*It is not required by the split.*/
  width: 100%;
}
	
/*Use grid for the split*/
@media screen and (min-width: 700px) {
  figure.split {
    /*We use grid to split the contents into two columns.*/
    /*Depending on the order of the figcaption (preceeding, following)*/ 
    /*it will be positioned to the left (preceeding) or to the right (following).*/
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1.62rem;
    row-gap: 1.62rem;
  }
  figure.split>* {
      margin: 0; /*we have column-gap and row-gap for the margins*/
  }
  figure.split>figcaption {
    /*center the figcaption vertically, thanks to grid*/
    margin-top: auto;
    margin-bottom: auto;
    
    /*have a little sticky-icing, not required*/
    position: sticky; 
    top: 0;
  }  
}
{% endhighlight %}
</figure>

<figure>
<figcaption>HTML</figcaption>
{% highlight html %}
<figure class="split">
  <img src="/img/IMG_1329.jpg" alt="">
  <figcaption>A beautiful day with Emil at the Paderborn Fishponds.</figcaption>
</figure>

<figure class="split">
  <figcaption>The Fishponds are a home for many waterbirds.</figcaption>
  <img src="/img/IMG_1331.jpg" alt="">
</figure>

<figure class="split"> <!--Nesting figures is allowed-->
  <figure>
    <img src="/img/IMG_1298.jpg" alt="">
    <figcaption>Emil´s hand with a Paderstone that has a sheep (or a dog) drawn on it.</figcaption>
  </figure>
  <figure>
    <img src="/img/IMG_1297.jpg" alt="">
    <figcaption>Emil´s hand presenting a Paderstone with a smiling red face drawn on it.</figcaption>
  </figure>
</figure>

<figure>
  <!--I´m giving the image a 100% width to ensure it takes all the space-->
  <img class="w-100" src="/img/IMG_1286.jpg" alt="">
  <figcaption>Sunset at the the Fishponds.</figcaption>
</figure>
{% endhighlight %}
</figure>


