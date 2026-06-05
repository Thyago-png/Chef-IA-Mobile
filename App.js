import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'; // ✅ ScrollView importado
import axios from 'axios';

// Chave de API utilizada com sucesso, porém removida por segurança.
// API key used successfully, but removed for security reasons.
const api = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    "Content-Type": 'application/json',
    "Authorization": `MySecretKey`
  }
});

export default function App() {
  const [ingredientes, setIngredientes] = useState('');
  const [receita, setReceita] = useState('');

  async function gerarReceita() {
    if (!ingredientes) return alert("Digite os ingredientes primeiro!");

    try {
      const resposta = await api.post('/chat/completions', {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Você é um chefe de cozinha muito criativo. Crie receitas simples e deliciosas'
          },
          {
            role: 'user',
            content: `Crie uma receita com esses ingredientes: ${ingredientes}`
          }
        ],
        temperature: 1,
        max_tokens: 1024
      });

      if (resposta.data.choices && resposta.data.choices.length > 0) {
        setReceita(resposta.data.choices[0].message.content);
      }
   } catch (error) {
  console.log("Status:", error?.response?.status);
  console.log("Mensagem:", error?.response?.data);
  console.log("Erro completo:", error?.message);
  alert(`Erro ${error?.response?.status}: ${JSON.stringify(error?.response?.data)}`);
}
  }

  return (
    <View style={styles.container}>
      <StatusBar style='light' />

      <View style={styles.header}>
        <Text style={styles.emoji}>👩🏻‍🍳</Text>
        <Text style={styles.title}> ChefIA </Text>
        <Text style={styles.subTitle}>Digite os ingredientes que você tem</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder='Ex: Frango, arroz, tomate, cebola...'
        multiline
        placeholderTextColor='#888'
        value={ingredientes}
        onChangeText={setIngredientes}
      />

      <TouchableOpacity style={styles.button} onPress={gerarReceita}>
        <Text style={styles.buttonText}> Gerar Receita</Text>
      </TouchableOpacity>

      {receita ? (
        <View style={styles.receitaWrapper}>
          <View style={styles.receitaHeader}>
            <Text style={styles.receitaHeaderText}>Sua Receita</Text>
          </View>
          <ScrollView style={styles.receitaContainer}> {/* ✅ ScrollView com S maiúsculo */}
            <Text style={styles.receita}>{receita}</Text>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderEmoji}>🍲</Text>
          <Text style={styles.placeholderText}>Sua Receita aparecerá aqui</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5
  },
  input: {
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e17055',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  receitaWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  receitaHeader: {
    backgroundColor: '#e17055',
    padding: 12,
    alignItems: 'center',
  },
  receitaHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  receitaContainer: {
    backgroundColor: '#2d2d44',
    padding: 15,
  },
  receita: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  }
});