import type { Route } from "./+types/home";
import DataTable from "~/features/shared/ui/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import useLoadDataset from "~/features/shared/hooks/useLoadDataset";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dataset Explorer" },
    { name: "description", content: "Exploring the Person dataset" },
  ];
}

interface Person {
  id: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  genero: string;
  email: string;
  telefono: string;
  pais: string;
  ciudad: string;
  profesion: string;
  salario: number;
  fecha_registro: string;
}

const columns: ColumnDef<Person>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Nombres", accessorKey: "nombres" },
  { header: "Apellidos", accessorKey: "apellidos" },
  { header: "Fecha Nacimiento", accessorKey: "fecha_nacimiento" },
  { header: "Género", accessorKey: "genero" },
  { header: "Email", accessorKey: "email" },
  { header: "Teléfono", accessorKey: "telefono" },
  { header: "País", accessorKey: "pais" },
  { header: "Ciudad", accessorKey: "ciudad" },
  { header: "Profesión", accessorKey: "profesion" },
  { header: "Salario", accessorKey: "salario" },
  { header: "Fecha Registro", accessorKey: "fecha_registro" },
];

export default function Home() {
  const loadDataset = useLoadDataset<Person>();

  useEffect(() => {
    loadDataset.execute("dataset");
  }, [loadDataset.execute]);

  return (
    <>
      {loadDataset.isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <DataTable
          title="Listado de clientes"
          data={loadDataset.data}
          error={loadDataset.error}
          columns={columns}
        />
      )}
    </>
  );
}
