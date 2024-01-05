<script setup>
    /* Button */
    import Download1 from "$/web/css/csscode/Button/Download1.vue";

    import Delete1 from "$/web/css/csscode/Button/Delete1.vue";

    import Add1 from "$/web/css/csscode/Button/Add1.vue";

    /* Loading */
    import Loading1 from "$/web/css/csscode/Loading/Loading1.vue";


/* 
::: details
::: code-group

```html [HTML]

```

```css [CSS]

```

:::
*/

</script>

# 纯 CSS

## Button

<Download1 />

::: details
::: code-group

```html [HTML]
<button class="button" type="button">
  <span class="button__text">Download</span>
  <span class="button__icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      id="bdd05811-e15d-428c-bb53-8661459f9307"
      data-name="Layer 2"
      class="svg">
      <path
        d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
      <path
        d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
      <path
        d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
    </svg>
  </span>
</button>
```

```css [CSS]
.button {
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #17795e;
  background-color: #209978;
  overflow: hidden;
}

.button,
.button__icon,
.button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(22px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(109px);
  height: 100%;
  width: 39px;
  background-color: #17795e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 20px;
  fill: #fff;
}

.button:hover {
  background: #17795e;
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 148px;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #146c54;
}

.button:active {
  border: 1px solid #146c54;
}
```

:::

<Delete1 />

::: details
::: code-group

```html [HTML]
<button class="button" type="button">
  <span class="button__text">Delete</span>
  <span class="button__icon">
    <svg
      class="svg"
      height="512"
      viewBox="0 0 512 512"
      width="512"
      xmlns="http://www.w3.org/2000/svg">
      <title></title>
      <path
        d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
        style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
      <line
        style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"
        x1="80"
        x2="432"
        y1="112"
        y2="112"></line>
      <path
        d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
        style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
      <line
        style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
        x1="256"
        x2="256"
        y1="176"
        y2="400"></line>
      <line
        style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
        x1="184"
        x2="192"
        y1="176"
        y2="400"></line>
      <line
        style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
        x1="328"
        x2="320"
        y1="176"
        y2="400"></line>
    </svg>
  </span>
</button>
```

```css [CSS]
.button {
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #cc0000;
  background-color: #e50000;
  overflow: hidden;
}

.button,
.button__icon,
.button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(35px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(109px);
  height: 100%;
  width: 39px;
  background-color: #cc0000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 20px;
}

.button:hover {
  background: #cc0000;
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 148px;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #b20000;
}

.button:active {
  border: 1px solid #b20000;
}
```

:::

<Add1 />

::: details
::: code-group

```html [HTML]
<button type="button" class="button">
  <span class="button__text">Add Item</span>
  <span class="button__icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke="currentColor"
      height="24"
      fill="none"
      class="svg">
      <line y2="19" y1="5" x2="12" x1="12"></line>
      <line y2="12" y1="12" x2="19" x1="5"></line>
    </svg>
  </span>
</button>
```

```css [CSS]
.button {
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #34974d;
  background-color: #3aa856;
}

.button,
.button__icon,
.button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(30px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(109px);
  height: 100%;
  width: 39px;
  background-color: #34974d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 30px;
  stroke: #fff;
}

.button:hover {
  background: #34974d;
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 148px;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #2e8644;
}

.button:active {
  border: 1px solid #2e8644;
}
```

:::

## Loading

<Loading1 />

::: details

```css
/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid;
  border-color: #409eff #0000;
  animation: l1 1s infinite;
}

@keyframes l1 {
  to {
    transform: rotate(0.5turn);
  }
}
```

:::
