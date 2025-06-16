import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface HealthIssue {
  id: string;
  name: string;
  selected: boolean;
}

interface UserProfileData {
  birthDate: string;
  age: number | null;
  weight: string;
  height: string;
  healthIssues: HealthIssue[];
  nutritionalInfo: string;
  goal: string;
}

const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};

const UserProfile = () => {
  const [profileData, setProfileData] = useState<UserProfileData>({
    birthDate: '',
    age: null,
    weight: '',
    height: '',
    healthIssues: [
      { id: '1', name: 'Diabetes', selected: false },
      { id: '2', name: 'Hipertensão', selected: false },
      { id: '3', name: 'Colesterol Alto', selected: false },
      { id: '4', name: 'Intolerância à Lactose', selected: false },
      { id: '5', name: 'Intolerância ao Glúten', selected: false },
      { id: '6', name: 'Alergias Alimentares', selected: false },
    ],
    nutritionalInfo: '',
    goal: 'manter'
  });
  
  const [customHealthIssue, setCustomHealthIssue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Calcular idade quando a data de nascimento mudar
  useEffect(() => {
    if (profileData.birthDate) {
      setProfileData(prev => ({
        ...prev,
        age: calculateAge(prev.birthDate)
      }));
    }
  }, [profileData.birthDate]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSaved(false);
  };
  
  const handleHealthIssueChange = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      healthIssues: prev.healthIssues.map(issue => 
        issue.id === id ? { ...issue, selected: !issue.selected } : issue
      )
    }));
    setIsSaved(false);
  };
  
  const addCustomHealthIssue = () => {
    if (customHealthIssue.trim() !== '') {
      const newId = (profileData.healthIssues.length + 1).toString();
      setProfileData(prev => ({
        ...prev,
        healthIssues: [
          ...prev.healthIssues,
          { id: newId, name: customHealthIssue.trim(), selected: true }
        ]
      }));
      setCustomHealthIssue('');
      setIsSaved(false);
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aqui você pode salvar os dados no localStorage ou enviar para um servidor
    localStorage.setItem('userProfileData', JSON.stringify(profileData));
    setIsSaved(true);
    
    // Mostrar mensagem de sucesso por 3 segundos
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  // Carregar dados do perfil do localStorage ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('userProfileData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setProfileData(parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    }
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Seu Perfil Nutricional</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Data de Nascimento e Idade */}
          <div>
            <label htmlFor="birthDate" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={profileData.birthDate}
              onChange={handleInputChange}
              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Idade
            </label>
            <input
              type="text"
              value={profileData.age !== null ? `${profileData.age} anos` : ''}
              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
          </div>
          
          {/* Peso e Altura */}
          <div>
            <label htmlFor="weight" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={profileData.weight}
              onChange={handleInputChange}
              placeholder="Ex: 70.5"
              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              step="0.1"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Altura (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={profileData.height}
              onChange={handleInputChange}
              placeholder="Ex: 175"
              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              step="1"
              min="0"
            />
          </div>
        </div>
        
        {/* Objetivo */}
        <div>
          <label htmlFor="goal" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Objetivo
          </label>
          <select
            id="goal"
            name="goal"
            value={profileData.goal}
            onChange={handleInputChange}
            className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="perder">Perder peso</option>
            <option value="manter">Manter peso</option>
            <option value="ganhar">Ganhar peso</option>
            <option value="ganhar_muscular">Ganhar massa muscular</option>
            <option value="saude">Melhorar saúde geral</option>
          </select>
        </div>
        
        {/* Problemas de Saúde */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Problemas de Saúde ou Restrições Alimentares
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {profileData.healthIssues.map(issue => (
              <div key={issue.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`issue-${issue.id}`}
                  checked={issue.selected}
                  onChange={() => handleHealthIssueChange(issue.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`issue-${issue.id}`} className="ml-2 text-xs md:text-sm text-gray-700">
                  {issue.name}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-3 flex">
            <input
              type="text"
              value={customHealthIssue}
              onChange={(e) => setCustomHealthIssue(e.target.value)}
              placeholder="Adicionar outro problema de saúde"
              className="flex-grow px-2 md:px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={addCustomHealthIssue}
              className="px-3 md:px-4 py-2 bg-green-600 text-white text-xs md:text-sm rounded-r-md hover:bg-green-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
        
        {/* Informações Nutricionais Adicionais */}
        <div>
          <label htmlFor="nutritionalInfo" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Informações Nutricionais Adicionais
          </label>
          <textarea
            id="nutritionalInfo"
            name="nutritionalInfo"
            value={profileData.nutritionalInfo}
            onChange={handleInputChange}
            placeholder="Ex: Sigo uma dieta vegetariana, tenho alergia a amendoim, etc."
            className="w-full px-2 md:px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
          />
        </div>
        
        {/* Botão de Salvar */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs md:text-sm font-medium"
          >
            Salvar Perfil
          </button>
          
          {isSaved && (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-xs md:text-sm">
              ✓ Perfil salvo com sucesso!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile; 