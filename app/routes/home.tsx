import type { Route } from "./+types/home";
import DataTable from "~/features/shared/ui/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
}

const persons: Person[] = [
  { id: 1, name: "Juan", age: 30, email: "[EMAIL_ADDRESS]", phone: "123456789", address: "123 Main St" },
  { id: 2, name: "Maria", age: 25, email: "[EMAIL_ADDRESS]", phone: "987654321", address: "456 Elm St" },
  { id: 3, name: "Pedro", age: 35, email: "[EMAIL_ADDRESS]", phone: "555555555", address: "789 Oak St" },
];

const columns: ColumnDef<Person>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Name", accessorKey: "name" },
  { header: "Age", accessorKey: "age" },
  { header: "Email", accessorKey: "email" },
  { header: "Phone", accessorKey: "phone" },
  { header: "Address", accessorKey: "address" },
];

export default function Home() {
  return <DataTable
    data={persons}
    columns={columns}
  />
}
