import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';

export default function App() {
    const [livro, setLivro] = useState('');
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    async function buscarLivro() {
        //validação básica
        if (!livro.trim()) {
            Alert.alert('Livro inválido', 'Digite o nome de um livro.');
            return;
        }

        setInfo(null);
        setLoading(true);

        try {
            const resposta = await fetch(`https://openlibrary.org/search.json?title=${livro}`);
            const dados = await resposta.json();

            if (dados.docs.length === 0) {
                Alert.alert('Livro não encontrado');
                return;
            }

            setInfo({
                titulo: dados.docs[0].titulo,
                autor: dados.docs[0].autor_nome
                    ? dados.docs[0].autor_nome[0]
                    : 'Autor desconhecido',
                ano: dados.docs[0].ano_de_publicacao
                    ? dados.docs[0].ano_de_publicacao
                    : 'Não informado',
            });
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível conectar. Verifique sua internet.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Aurora Library</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite o nome do livro"
                value={livro}
                onChangeText={setLivro}
                maxLength={200}
            />

            <TouchableOpacity style={styles.botao} onPress={buscarLivro}>
                <Text style={styles.botaoTexto}>Pesquisar</Text>
            </TouchableOpacity>

            {loading && (
                <ActivityIndicator size="large" color="#faa7ef" style={{ marginTop: 24 }} />
            )}

            {info && (
                <View style={styles.resultado}>
                    <Text style={styles.item}>Livro: {info.titulo}</Text>
                    <Text style={styles.item}>Autor: {info.autor}</Text>
                    <Text style={styles.item}>Ano de publicação: {info.ano}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 24,
        paddingTop: 80,
    },
    titulo: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '#f777bd',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 16,
    },
    botao: {
        backgroundColor: '#f777bd',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#f777bd',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    botaoTexto: {
        color: '#121212',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultado: {
        marginTop: 32,
        backgroundColor: '#1a1f2e',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#f777bd',
        shadowColor: '#f777bd',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },

    item: {
        fontSize: 18,
        color: '#F5F5F5',
        marginBottom: 14,
        lineHeight: 33,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#2a2f40',
        borderRadius: 12,
    },
});
