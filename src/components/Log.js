import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import LogService from "../services/logService";

const Log = () => {
  const [logs, setLogs] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50
  });
  const [columnSetting] = useState({
    columns: [
      {
        field: 'id',
        headerName: 'Id',
        flex: 0.1,
        minWidth: 150,
      },
      {
        field: 'username',
        headerName: 'Usuario',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'type_search',
        headerName: 'Tipo de busqueda',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'search_id',
        headerName: 'Id de busqueda',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'datetime',
        headerName: 'Fecha y Hora',
        flex: 1,
        minWidth: 100,
      }
    ],
    initialState: {columns: {columnVisibilityModel: {id: false}}}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await LogService.getAllLogs();
        setLogs(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <DataGrid
        rows={logs}
        {...columnSetting}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[50]}
      />
    </div>
  );
};

export default Log;
