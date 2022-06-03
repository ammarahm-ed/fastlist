# fast-list
A fast list implementation for React Native with a RecyclerView style API.

*Barebones example:*

```js
    // @ts-ignore (AUTO)
    const renderRow = (section, row) => {
      const userId = results[row];
      return <Row userId={userId} />;
    };

    content = (
      <FastList
        style={[styles.flex, {marginBottom: keyboardHeight}]}
        contentContainerStyle={{paddingBottom: keyboardHeight === 0 ? SAFE_AREA_BOTTOM : 0}}
        rowHeight={55}
        // @ts-ignore (AUTO)
        renderRow={renderRow}
        keyboardShouldPersistTaps="always"
        sections={[results.length]}
      />
```
