/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';

const hashMultiplicative = (key, tableSize) => {
    const A = (Math.sqrt(5) - 1) / 2;
    const hashedValue = Math.floor(tableSize * ((key * A) % 1)); 
    return hashedValue;
  };
  
const stringToNumber = (str) => {
  if (typeof str !== 'string') return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 13 + str.charCodeAt(i)) % Number.MAX_SAFE_INTEGER;
  }
  return hash%100000;
};

const HashTable = ({ data }) => {
  const tableSize = 60;
  const [hashTable, setHashTable] = useState(Array(tableSize).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [deleteKey, setDeleteKey] = useState('');
  const [method, setMethod] = useState('quadratic');
  const [keyAttempts, setKeyAttempts] = useState([]);

  const insertWithQuadraticProbing = (key, table) => {
    if (key === undefined || key === null) return { table, attempts: 0 };

    const numericKey = isNaN(key) ? stringToNumber(key) : parseInt(key, 10);
    let index = hashMultiplicative(numericKey, tableSize);
    let i = 0;
    let attempts = 0;

    while (table[(index + i * i) % tableSize] !== null) {
      i++;
      attempts++;
      if (i === tableSize) return { table, attempts };
    }

    table[(index + i * i) % tableSize] = numericKey;
    attempts++;
    return { table, attempts };
  };

    const insertWithChaining = (key, table) => {
        const numericKey = stringToNumber(key);
        const index = hashMultiplicative(numericKey, tableSize);

        if (!table[index]) table[index] = []; 
        table[index].push(numericKey);

        return { table, attempts: 1 };
    };
  
  const insertKey = (key, table) => {
    if (method === 'quadratic') {
      return insertWithQuadraticProbing(key, table);
    } else if (method === 'chaining') {
      return insertWithChaining(key, table);
    }
    return { table, attempts: 0 };
  };

  useEffect(() => {
    if (data && data.length) {
      setIsLoading(true);
      let newTable = Array(tableSize).fill(null);
      let attemptsSum = 0;
      let attemptsPerKey = [];
  
      setTimeout(() => {
        data.forEach((row, rowIndex) => {
          if (rowIndex > 0) {
            if (method === 'quadratic') {
              const key = row[2]; 
              const { table, attempts } = insertKey(key, newTable);
              newTable = table;
              attemptsSum += attempts;
              attemptsPerKey.push({ key, attempts });
            } else if (method === 'chaining') {
              row.forEach((key) => {
                const { table, attempts } = insertKey(key, newTable);
                newTable = table;
                attemptsSum += attempts;
                attemptsPerKey.push({ key, attempts });
              });
            }
          }
        });
        setHashTable(newTable);
        setTotalAttempts(attemptsSum);
        setKeyAttempts(attemptsPerKey);
        setIsLoading(false);
      }, 1000);
    }
  }, [data, method]); // eslint-disable-next-line react-hooks/exhaustive-deps

  

    const handleSearch = () => {
        const numericKey = isNaN(searchKey) ? stringToNumber(searchKey) : parseInt(searchKey, 10);
        let index = hashMultiplicative(numericKey, tableSize);
        let i = 0;
    
        if (Array.isArray(hashTable[index])) {
        const chain = hashTable[index];
        const found = chain.some(item => item === numericKey);
    
        if (found) {
            setSearchResult(`Ключ найден на индексе: ${index}`);
            return;
        }
        }
    
        while (hashTable[(index + i * i) % tableSize] !== null) {
        if (hashTable[(index + i * i) % tableSize] === numericKey) {
            setSearchResult(`Ключ найден на индексе: ${(index + i * i) % tableSize}`);
            return;
        }
        i++;
        if (i === tableSize) break;
        }
    
        setSearchResult('Ключ не найден.');
    };
  
  const handleDeleteQuadratic = () => {
    const numericKey = isNaN(deleteKey) ? stringToNumber(deleteKey) : parseInt(deleteKey, 10);
    let index = hashMultiplicative(numericKey, tableSize);
    let i = 0;

    while (hashTable[(index + i * i) % tableSize] !== null) {
      if (hashTable[(index + i * i) % tableSize] === numericKey) {
        hashTable[(index + i * i) % tableSize] = null;
        setHashTable([...hashTable]); 
        alert('Ключ успешно удален.');
        return;
      }
      i++;
      if (i === tableSize) break;
    }
    alert('Ключ не найден.');
  };
    const handleDeleteChain = () => {
        const numericKey = isNaN(deleteKey) ? stringToNumber(deleteKey) : parseInt(deleteKey, 10);
        let index = hashMultiplicative(numericKey, tableSize);
    
        if (Array.isArray(hashTable[index])) {
        const chain = hashTable[index];
    
        const chainIndex = chain.findIndex(item => item === numericKey);
    
        if (chainIndex !== -1) {
            const newChain = [...chain];
            newChain.splice(chainIndex, 1);
    
            const newTable = [...hashTable];
            newTable[index] = newChain.length > 0 ? newChain : null;
    
            setHashTable(newTable); 
            alert('Ключ успешно удален.');
            return;
        }
    }
  
    alert('Ключ не найден.');
  };
  
  
  return (
    <div className="bg-[#fffde6] w-full min-h-screen text-black font-montserrat flex flex-col items-center">
        <header className="w-full bg-[#f7e74f] p-4 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Хэширование</h1>
            <div className="flex gap-4">
                <button
                onClick={() => setMethod('chaining')}
                className={`px-4 py-2 rounded ${method === 'chaining' ? 'bg-green-500 text-white' : 'bg-gray-200'} hover:bg-green-600`}
                >
                Метод цепочек
                </button>
                <button
                onClick={() => setMethod('quadratic')}
                className={`px-4 py-2 rounded ${method === 'quadratic' ? 'bg-green-500 text-white' : 'bg-gray-200'} hover:bg-green-600`}
                >
                Метод открытой адресации
                </button>
            </div>
        </header>

      {isLoading ? (
        <div className="flex flex-col items-center mt-10">
          <div className="loader border-t-4 border-b-4 border-yellow-500 rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-lg font-bold">Загрузка таблицы...</p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-8 mt-10">
            Хэш-таблица: {method === 'quadratic' ? 'Квадратичное Опробование' : 'Метод Цепочек'}
          </h1>
          { method === 'quadratic' && (
          <h2 className="text-xl font-bold mb-4">Общее количество попыток: {totalAttempts}</h2>
          )}
          <div className="flex gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-2">Поиск по ключу</h3>
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Поиск
              </button>
              <p className="mt-2">{searchResult}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Удаление по ключу</h3>
              <input
                type="text"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                onClick={method === 'quadratic' ? handleDeleteQuadratic : handleDeleteChain}
                className="ml-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          </div>
          <table className="table-auto w-full border-collapse border border-[#f7d22c] shadow-lg mb-8">
            <thead>
                <tr className="bg-[#f9e532]">
                <th className="border border-[#f7d22c] px-4 py-2 text-left">Индекс</th>
                <th className="border border-[#f7d22c] px-4 py-2 text-left">Значение</th>
                </tr>
            </thead>
            <tbody>
                {hashTable.map((value, index) => (
                <tr
                    key={index}
                    className={`${
                    index % 2 === 0 ? 'bg-[#faec70]' : 'bg-[#f7e74f]'
                    } hover:bg-[#f9e532] transition`}
                >
                    <td className="border border-[#f7d22c] px-4 py-2">{index}</td>
                    <td className="border border-[#f7d22c] px-4 py-2">
                        {Array.isArray(value) ? value.join(', ') : value !== null ? value : 'Пусто'}
                    </td>

                </tr>
                ))}
            </tbody>
            </table>
            { method === 'quadratic' && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-2">Попытки по каждому ключу:</h3>
              <ul className="list-disc pl-6">
                  {keyAttempts.map(({ key, attempts }, index) => (
                      <li key={index}>
                          Ключ: {key}, Попытки: {attempts}
                      </li>
                  ))}
              </ul>
            </div>
            )}
          <h3 className="text-lg font-bold mb-2">Данные из файла:</h3>
          <table className="table-auto w-full border-collapse border border-[#ccc] shadow-lg">
            <thead>
              <tr className="bg-[#f2f2f2]">
                {data[0].map((header, index) => (
                  <th key={index} className="border px-4 py-2 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default HashTable;
