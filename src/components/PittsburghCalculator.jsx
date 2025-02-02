'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PittsburghCalculator = () => {
  const [answers, setAnswers] = useState({
    bedTime: '',
    sleepLatency: '',
    wakeTime: '',
    sleepHours: '',
    q5a: '',
    q5b: '',
    q5c: '',
    q5d: '',
    q5e: '',
    q5f: '',
    q5g: '',
    q5h: '',
    q5i: '',
    q5j: '',
    q6: '',
    q7: '',
    q8: '',
    q9: ''
  });

  const [scores, setScores] = useState({
    component1: '-',
    component2: '-',
    component3: '-',
    component4: '-',
    component5: '-',
    component6: '-',
    component7: '-',
    total: '-'
  });

  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // Verificar si todas las preguntas están respondidas
    const requiredFields = [
      'bedTime', 'sleepLatency', 'wakeTime', 'sleepHours',
      'q5a', 'q5b', 'q5c', 'q5d', 'q5e', 'q5f', 'q5g', 'q5h', 'q5i', 'q5j',
      'q6', 'q7', 'q8', 'q9'
    ];
    
    const allFieldsCompleted = requiredFields.every(field => answers[field] !== '');
    setIsComplete(allFieldsCompleted);

    if (allFieldsCompleted) {
      calculateScores();
    }
  }, [answers]);

  const calculateScores = () => {
    // Componente 1: Calidad subjetiva del sueño
    const component1 = parseInt(answers.q6);

    // Componente 2: Latencia del sueño
    let latencyScore = 0;
    if (answers.sleepLatency) {
      if (answers.sleepLatency <= 15) latencyScore = 0;
      else if (answers.sleepLatency <= 30) latencyScore = 1;
      else if (answers.sleepLatency <= 60) latencyScore = 2;
      else latencyScore = 3;
    }
    const q5aScore = parseInt(answers.q5a);
    const component2 = Math.min(3, Math.floor((latencyScore + q5aScore) / 2));

    // Componente 3: Duración del sueño
    let component3 = 0;
    const hours = parseFloat(answers.sleepHours);
    if (hours > 7) component3 = 0;
    else if (hours >= 6) component3 = 1;
    else if (hours >= 5) component3 = 2;
    else if (hours > 0) component3 = 3;

    // Componente 4: Eficiencia del sueño
    let component4 = 0;
    const bedTime = answers.bedTime ? new Date(`2000-01-01 ${answers.bedTime}`) : null;
    const wakeTime = answers.wakeTime ? new Date(`2000-01-01 ${answers.wakeTime}`) : null;
    
    if (bedTime && wakeTime && answers.sleepHours) {
      let timeInBed;
      if (wakeTime < bedTime) {
        wakeTime.setDate(wakeTime.getDate() + 1);
      }
      timeInBed = (wakeTime - bedTime) / (1000 * 60 * 60);
      const efficiency = (hours / timeInBed) * 100;
      
      if (efficiency >= 85) component4 = 0;
      else if (efficiency >= 75) component4 = 1;
      else if (efficiency >= 65) component4 = 2;
      else component4 = 3;
    }

    // Componente 5: Perturbaciones del sueño
    const perturbationSum = [
      answers.q5b, answers.q5c, answers.q5d, answers.q5e,
      answers.q5f, answers.q5g, answers.q5h, answers.q5i, answers.q5j
    ].reduce((sum, current) => sum + parseInt(current), 0);

    let component5 = 0;
    if (perturbationSum >= 1 && perturbationSum <= 9) component5 = 1;
    else if (perturbationSum >= 10 && perturbationSum <= 18) component5 = 2;
    else if (perturbationSum >= 19) component5 = 3;

    // Componente 6: Uso de medicación para dormir
    const component6 = parseInt(answers.q7);

    // Componente 7: Disfunción diurna
    const daytimeDysfunction = parseInt(answers.q8) + parseInt(answers.q9);
    let component7 = 0;
    if (daytimeDysfunction >= 1 && daytimeDysfunction <= 2) component7 = 1;
    else if (daytimeDysfunction >= 3 && daytimeDysfunction <= 4) component7 = 2;
    else if (daytimeDysfunction >= 5) component7 = 3;

    const total = component1 + component2 + component3 + component4 + 
                 component5 + component6 + component7;

    setScores({
      component1,
      component2,
      component3,
      component4,
      component5,
      component6,
      component7,
      total
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className='pb-10 text-center pt-4'>
        <CardTitle>Calculadora del Índice de Calidad del Sueño de Pittsburgh</CardTitle>
      </CardHeader>
    
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Hora de acostarse:</label>
              <input
                type="time"
                name="bedTime"
                value={answers.bedTime}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Tiempo en dormirse (minutos):</label>
              <input
                type="number"
                name="sleepLatency"
                value={answers.sleepLatency}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Hora de levantarse:</label>
              <input
                type="time"
                name="wakeTime"
                value={answers.wakeTime}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Horas de sueño real:</label>
              <input
                type="number"
                name="sleepHours"
                value={answers.sleepHours}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">5. Problemas para dormir:</h3>
            {[
              { id: 'q5a', text: 'No poder conciliar el sueño en la primera media hora' },
              { id: 'q5b', text: 'Despertarse durante la noche o de madrugada' },
              { id: 'q5c', text: 'Tener que levantarse para ir al servicio' },
              { id: 'q5d', text: 'No poder respirar bien' },
              { id: 'q5e', text: 'Toser o roncar ruidosamente' },
              { id: 'q5f', text: 'Sentir frío' },
              { id: 'q5g', text: 'Sentir demasiado calor' },
              { id: 'q5h', text: 'Tener pesadillas o malos sueños' },
              { id: 'q5i', text: 'Sufrir dolores' },
              { id: 'q5j', text: 'Otras razones' }
            ].map(question => (
              <div key={question.id} className="space-y-1">
                <label className="block text-sm">{question.text}:</label>
                <select
                  name={question.id}
                  value={answers[question.id]}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="0">Ninguna vez en el último mes</option>
                  <option value="1">Menos de una vez a la semana</option>
                  <option value="2">Una o dos veces a la semana</option>
                  <option value="3">Tres o más veces a la semana</option>
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">6. Calidad del sueño:</label>
              <select
                name="q6"
                value={answers.q6}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="0">Muy buena</option>
                <option value="1">Bastante buena</option>
                <option value="2">Bastante mala</option>
                <option value="3">Muy mala</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">7. Toma de medicación para dormir:</label>
              <select
                name="q7"
                value={answers.q7}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="0">Ninguna vez en el último mes</option>
                <option value="1">Menos de una vez a la semana</option>
                <option value="2">Una o dos veces a la semana</option>
                <option value="3">Tres o más veces a la semana</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">8. Somnolencia durante actividades:</label>
              <select
                name="q8"
                value={answers.q8}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="0">Ninguna vez en el último mes</option>
                <option value="1">Menos de una vez a la semana</option>
                <option value="2">Una o dos veces a la semana</option>
                <option value="3">Tres o más veces a la semana</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">9. Problemas de ánimo:</label>
              <select
                name="q9"
                value={answers.q9}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="0">Ningún problema</option>
                <option value="1">Solo un leve problema</option>
                <option value="2">Un problema</option>
                <option value="3">Un grave problema</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Resultados:</h3>
            {!isComplete ? (
              <p className="text-yellow-600">Complete todas las preguntas para ver los resultados</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>Calidad Subjetiva: {scores.component1}</p>
                    <p>Latencia: {scores.component2}</p>
                    <p>Duración: {scores.component3}</p>
                    <p>Eficiencia: {scores.component4}</p>
                  </div>
                  <div>
                    <p>Perturbaciones: {scores.component5}</p>
                    <p>Medicación: {scores.component6}</p>
                    <p>Disfunción Diurna: {scores.component7}</p>
                    <p className="font-bold mt-2">Puntuación total: {scores.total}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p className="font-medium">Interpretación:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>0-5: Sin problemas de sueño</li>
                    <li>6-8: Merece atención médica</li>
                    <li>9-14: Merece atención y tratamiento médico</li>
                    <li>15-21: Problema grave de sueño</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PittsburghCalculator;