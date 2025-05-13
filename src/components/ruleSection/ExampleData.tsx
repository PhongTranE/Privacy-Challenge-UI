import { Table, TableTbody, TableThead } from "@mantine/core";

interface UserDataRow {
  id_user: number | string;
  [key: string]: any;
}

const userData: UserDataRow[] = [
  {
    id_user: 17850,
    "0": "AAAAA1",
    "1": "AAAAA1",
    "2": "AAAAA1",
    "3": "AAAAA2",
    "9": "DEL",
    "10": "AAAAA4",
    "11": "AAAAA4",
    "12": "DEL",
  },
  {
    id_user: 12583,
    "0": "CCCCC1",
    "1": "CCCCC1",
    "2": "CCCCC1",
    "3": "DEL",
    "9": "CCCCC1",
    "10": "DEL",
    "11": "DEL",
    "12": "CCCCC1",
  },
];

const columnHeaders = [
  "Id_user",
  "0",
  "1",
  "2",
  "3",
  "...",
  "9",
  "10",
  "11",
  "12",
];
function ExampleData() {
  const rows = userData.map((rowData, index) => (
    <Table.Tr key={rowData.id_user || index}>
      <Table.Td>{rowData.id_user}</Table.Td>
      {columnHeaders.slice(1).map((headerKey) => (
        <Table.Td key={`${rowData.id_user}-${headerKey}`}>
          {rowData[headerKey]}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <>
      <Table withTableBorder withColumnBorders>
        <TableThead>
          <Table.Tr>
            {columnHeaders.map((header, index) => (
              <Table.Th key={index}>{header}</Table.Th>
            ))}
          </Table.Tr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </>
  );
}

export default ExampleData;
