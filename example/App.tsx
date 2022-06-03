import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Row = {
  id: string;
  index: number;
  title: string;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  list: {
    backgroundColor: "#fff",
    alignSelf: "stretch",
    flex: 1,
  },
  align: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    marginHorizontal: 5,
    marginBottom: 10,
    height: 40,
  },
  header: {
    backgroundColor: "#c9c2ff",
    marginHorizontal: 5,
    marginVertical: 10,
    height: 30,
  },
  headerText: {
    fontSize: 20,
  },
});

function generateRows(): Row[] {
  let rows = Array();

  let i: number;
  for (i = 0; i < 10000; i++) {
    const guid = [...Array(10)]
      .map((i) => (~~(Math.random() * 36)).toString(36))
      .join("");

    rows.push({
      id: guid,
      index: i,
      title: `Row: ${i}`,
    });
  }

  return rows;
}

const DATA_FAST_LIST = generateRows();
const DATA_FLAT_LIST = generateRows();

const rowHeight = (section, row) => {
  return row % 2 === 0 ? 100 : 50;
};

const renderHeader = (headerText: string) => {
  return (
    <View style={[styles.header, styles.align]}>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  );
};

const renderRow = (section: number, row: number) => {
  const text = `Section d: ${section}, row: ${row}`;
  return (
    <View style={[styles.item, styles.align]}>
      <Text>{text}</Text>
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container]}>
        <HorizontalFastList
          style={styles.list}
          batchSize={(height, velocity) => {
            return height;
          }}
          rowHeight={50}
          headerHeight={50}
          horizontal={true}
          renderHeader={() => renderHeader("Fast List")}
          renderRow={renderRow}
          sections={[DATA_FAST_LIST.length]}
          contentContainerStyle={{
            height: 100,
          }}
        />

        <FastList
          style={styles.list}
          batchSize={(height, velocity) => {
            return height;
          }}
          rowHeight={50}
          headerHeight={50}
          renderHeader={() => renderHeader("Fast List")}
          renderRow={renderRow}
          sections={[DATA_FAST_LIST.length]}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
