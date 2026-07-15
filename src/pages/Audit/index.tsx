import {
  useCallback,
  useEffect,
  useState,
} from "react";


import {
  getAuditLogs,
  getAuditSummary,
  exportAuditLogs,
} from "../../services/audit";

import type {
  AuditLog,
  AuditSummary,
} from "../../types/audit";

import { AuditCards } from "../../components/audit/AuditCards";
import { AuditFilters } from "../../components/audit/AuditFilters";
import { AuditTable } from "../../components/audit/AuditTable";


interface AuditFiltersState {
  usuario?: string;
  acao?: string;
  entidade?: string;
}


export function Audit() {

  const [logs, setLogs] =
    useState<AuditLog[]>([]);


  const [summary, setSummary] =
    useState<AuditSummary>({
      total: 0,
    });


  const [page, setPage] =
    useState(1);


  const [totalPages, setTotalPages] =
    useState(1);


  const [loading, setLoading] =
    useState(false);


  const [filters, setFilters] =
    useState<AuditFiltersState>({});



  const loadAudit = useCallback(
    async () => {

      try {

        setLoading(true);


        const response =
          await getAuditLogs({
            page,
            limit: 10,
            ...filters,
          });


        setLogs(
          response.data
        );


        setTotalPages(
          response.totalPages
        );


        const summaryData =
          await getAuditSummary();


        setSummary(
          summaryData
        );


      } catch (error) {

        console.error(
          "Erro ao carregar auditoria:",
          error
        );


      } finally {

        setLoading(false);

      }

    },
    [
      page,
      filters,
    ]
  );

useEffect(() => {

  async function fetchAudit() {
    await loadAudit();
  }

  fetchAudit();

}, [loadAudit]);



  function handleFilter(
    data: AuditFiltersState
  ) {

    setPage(1);

    setFilters(data);

  }




  async function handleExport() {

    try {

      const blob =
        await exportAuditLogs();


      const url =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement("a");


      link.href = url;


      link.download =
        "carehome_auditoria.csv";



      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );


      window.URL.revokeObjectURL(
        url
      );


    } catch (error) {

      console.error(
        "Erro ao exportar auditoria:",
        error
      );

    }

  }



  return (

    <div>


      <div
        className="
          p-6
        "
      >


        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >

          <h1
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            Auditoria do Sistema
          </h1>



          <button
            onClick={handleExport}
            className="
              bg-green-600
              text-white
              px-4
              py-2
              rounded-lg
              hover:bg-green-700
              transition
            "
          >
            Exportar CSV
          </button>


        </div>



        <AuditCards
          summary={summary}
        />



        <AuditFilters
          onSearch={handleFilter}
        />



        {
          loading &&
          logs.length === 0 ? (

            <div
              className="
                text-center
                py-10
                text-gray-500
              "
            >
              Carregando auditoria...
            </div>


          ) : (

            <AuditTable
              logs={logs}
            />

          )
        }



        <div
          className="
            flex
            justify-center
            items-center
            gap-4
            mt-6
          "
        >

          <button
            disabled={
              page === 1
            }
            onClick={() =>
              setPage(
                page - 1
              )
            }
            className="
              px-4
              py-2
              border
              rounded-lg
              disabled:opacity-50
            "
          >
            Anterior
          </button>



          <span
            className="
              text-gray-600
            "
          >
            Página {page} de {totalPages}
          </span>



          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(
                page + 1
              )
            }
            className="
              px-4
              py-2
              border
              rounded-lg
              disabled:opacity-50
            "
          >
            Próxima
          </button>


        </div>


      </div>


    </div>

  );
}