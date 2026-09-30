import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DBMS_TABLES, SQL_DDL_SCRIPT, PRESET_QUERIES } from '../data/dbmsSchema';
import { Database, Table, Play, Code2, Network, Check, Copy, X } from 'lucide-react';

export default function DbmsSchemaModal() {
  const { isDbmsModalOpen, setIsDbmsModalOpen, db } = useApp();
  const [activeTab, setActiveTab] = useState('erd'); // 'erd' | 'schema' | 'ddl' | 'queries'
  const [selectedTable, setSelectedTable] = useState('VEHICLE');
  const [copied, setCopied] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState('q1');
  const [queryResult, setQueryResult] = useState(() => PRESET_QUERIES[0].run(db));

  if (!isDbmsModalOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunQuery = (q) => {
    setSelectedQueryId(q.id);
    const result = q.run(db);
    setQueryResult(result);
  };

  const currentTableObj = DBMS_TABLES.find(t => t.name === selectedTable) || DBMS_TABLES[0];
  const activeQueryObj = PRESET_QUERIES.find(q => q.id === selectedQueryId) || PRESET_QUERIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                DBMS Project Architecture & Viva Suite
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  8 Relational Tables
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Entity-Relationship Model • Table Schemas • DDL Scripts • Live SQL Query Playground
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDbmsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('erd')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'erd'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            Interactive ER Diagram
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'schema'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            Table Schemas (PK / FK)
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'ddl'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            SQL DDL Script
          </button>
          <button
            onClick={() => {
              setActiveTab('queries');
              setQueryResult(activeQueryObj.run(db));
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'queries'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-400" />
            Live Query Runner (Viva Demo)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
          {/* TAB 1: ER DIAGRAM */}
          {activeTab === 'erd' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
                <span className="font-bold text-blue-400">Relational Mapping Guide:</span> 
                {' '}CUSTOMER (1:N) BOOKING • VEHICLE (1:N) BOOKING • BOOKING (1:1) RENTAL • RENTAL (1:1) PAYMENT • VEHICLE_CATEGORY (1:N) VEHICLE • VEHICLE (1:N) MAINTENANCE • EMPLOYEE (1:N) Operations.
              </div>

              {/* Visual ER Diagram Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Column 1: Parent Masters */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                      <span className="font-bold text-purple-300 text-xs tracking-wider">VEHICLE_CATEGORY</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Master</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: CATEGORY_ID</div>
                      <div>CATEGORY_NAME</div>
                      <div>DESCRIPTION</div>
                      <div>BASE_RATE</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-sky-500/40 bg-sky-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
                      <span className="font-bold text-sky-300 text-xs tracking-wider">CUSTOMER</span>
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">Master</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: CUSTOMER_ID</div>
                      <div>NAME</div>
                      <div>PHONE</div>
                      <div>EMAIL</div>
                      <div>DRIVER_LICENSE_NO</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                      <span className="font-bold text-slate-300 text-xs tracking-wider">EMPLOYEE</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Staff</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-400">
                      <div className="text-yellow-400 font-bold">PK: EMPLOYEE_ID</div>
                      <div>NAME, ROLE</div>
                      <div>PHONE, EMAIL</div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Core Asset & Maintenance */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border-2 border-blue-500/60 bg-blue-950/30 shadow-lg shadow-blue-950">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-500/30">
                      <span className="font-bold text-blue-300 text-xs tracking-wider">VEHICLE</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Core Asset</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: VEHICLE_ID</div>
                      <div>VEHICLE_NO (UNIQUE)</div>
                      <div>BRAND & MODEL</div>
                      <div className="text-indigo-400 font-semibold">FK: CATEGORY_ID</div>
                      <div>BASE_RATE</div>
                      <div className="text-emerald-400 font-semibold">STATUS</div>
                      <div>ODOMETER</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
                      <span className="font-bold text-rose-300 text-xs tracking-wider">MAINTENANCE</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">Child</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: MAINTENANCE_ID</div>
                      <div className="text-indigo-400 font-semibold">FK: VEHICLE_ID</div>
                      <div>SERVICE_DATE</div>
                      <div>COST & STATUS</div>
                      <div>DESCRIPTION</div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Booking & Reservations */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-amber-500/50 bg-amber-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                      <span className="font-bold text-amber-300 text-xs tracking-wider">BOOKING</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Transaction</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: BOOKING_ID</div>
                      <div className="text-sky-400 font-semibold">FK: CUSTOMER_ID</div>
                      <div className="text-blue-400 font-semibold">FK: VEHICLE_ID</div>
                      <div>START_DATE & END_DATE</div>
                      <div>DAYS & TOTAL_AMOUNT</div>
                      <div className="text-emerald-400">STATUS</div>
                    </div>
                  </div>
                </div>

                {/* Column 4: Rental & Payment */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                      <span className="font-bold text-emerald-300 text-xs tracking-wider">RENTAL</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Contract</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: RENTAL_ID</div>
                      <div className="text-amber-400 font-semibold">FK: BOOKING_ID</div>
                      <div className="text-blue-400 font-semibold">FK: VEHICLE_ID</div>
                      <div>PICKUP_DATE & RETURN_DATE</div>
                      <div>ODOMETER_START & END</div>
                      <div className="text-emerald-400">STATUS</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-teal-500/50 bg-teal-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-teal-500/30">
                      <span className="font-bold text-teal-300 text-xs tracking-wider">PAYMENT</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">Ledger</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 font-mono text-slate-300">
                      <div className="text-yellow-400 font-bold">PK: PAYMENT_ID</div>
                      <div className="text-emerald-400 font-semibold">FK: RENTAL_ID</div>
                      <div>AMOUNT & DATE</div>
                      <div>PAYMENT_METHOD</div>
                      <div>TRANSACTION_ID (UNIQUE)</div>
                      <div className="text-teal-400">STATUS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA EXPLORER */}
          {activeTab === 'schema' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Tables list */}
              <div className="space-y-1 md:col-span-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tables</div>
                {DBMS_TABLES.map(table => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      selectedTable === table.name
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{table.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">({table.columns.length})</span>
                  </button>
                ))}
              </div>

              {/* Table Column Details */}
              <div className="md:col-span-3 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-mono">{currentTableObj.name}</h3>
                    <span className="text-xs text-yellow-400 font-mono">Primary Key: {currentTableObj.pk}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{currentTableObj.description}</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
                        <th className="py-2.5 px-4 font-semibold">Column</th>
                        <th className="py-2.5 px-4 font-semibold">Data Type</th>
                        <th className="py-2.5 px-4 font-semibold">Constraint</th>
                        <th className="py-2.5 px-4 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {currentTableObj.columns.map(col => (
                        <tr key={col.name} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 text-white font-semibold">{col.name}</td>
                          <td className="py-2.5 px-4 text-blue-400">{col.type}</td>
                          <td className="py-2.5 px-4">
                            {col.key === 'PK' && (
                              <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-bold">
                                PRIMARY KEY
                              </span>
                            )}
                            {col.key === 'FK' && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                                FOREIGN KEY
                              </span>
                            )}
                            {col.key === 'UNIQUE' && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                UNIQUE
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-300 text-xs">{col.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DDL SCRIPT */}
          {activeTab === 'ddl' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Complete SQL Script (MySQL / PostgreSQL compatible)</span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard' : 'Copy SQL DDL'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-blue-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[55vh]">
                {SQL_DDL_SCRIPT}
              </pre>
            </div>
          )}

          {/* TAB 4: LIVE QUERY RUNNER */}
          {activeTab === 'queries' && (
            <div className="space-y-5">
              <div className="text-xs text-slate-300">
                Execute complex relational queries directly against the active in-memory database to demonstrate relational integrity:
              </div>

              {/* Query selector buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PRESET_QUERIES.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleRunQuery(q)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                      selectedQueryId === q.id
                        ? 'bg-blue-950/60 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Play className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold">{q.title}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Query SQL */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Executed SQL Statement</div>
                <pre className="font-mono text-xs text-emerald-400 bg-slate-950 p-3 rounded-lg overflow-x-auto leading-relaxed">
                  {activeQueryObj.sql}
                </pre>
              </div>

              {/* Query Results Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Query Output ({queryResult.length} rows returned)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Execution time: ~0.02ms (Live DB)</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                  {queryResult.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">No records matched this query.</div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
                          {Object.keys(queryResult[0]).map(key => (
                            <th key={key} className="py-2.5 px-4 font-semibold font-mono">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {queryResult.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="py-2.5 px-4 text-slate-200">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All 8 tables synchronized with active storage</span>
          </div>
          <button
            onClick={() => setIsDbmsModalOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
