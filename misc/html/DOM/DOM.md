# DOM

1. innerHTML, outerHTML, innerText, outerText, textContent

1. 空元素（Empty Element)
https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
1. 一些标签必须位于特定的标签之内才有效果。`<select>`标签必须有`multiple`属性不默认选中任何选项，单选会默认选中第一个选项。`<col>`必须有`<tbody>`否则`<colgroup>`无法正确生成。
```
<option>,<optgroup> | <select multiple>...</select>
<legend> | <fieldset>...</fieldset>
<thead>,<tbody>,<tfoot>,<colgroup>,<caption> | <table>...</table>
<tr> | <table><thead>...</thead></table>
<tr> | <table><tbody>...</tbody></table>
<tr> | <table><tfoot>...</tfoot></table>
<td>,<th> | <table><tbody><tr>...</tr></tbody></table>
<col> | <table><tbody></tbody><colgroup>...</colgroup></table>
```
1. DocumentFragment
1. DOM properties & attributes
1. layout thrashing https://devhints.io/layout-thrashing
