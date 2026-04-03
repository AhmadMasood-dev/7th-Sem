package q3;

import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class InterviewServer {

    private static final int PORT = 6006;

    // Multithreading: handle many clients at same time
    private static final ExecutorService pool = Executors.newFixedThreadPool(50);

    // Questions to ask (you can add more)
    private static final String[] QUESTIONS = {
            "What is your name?",
            "What is your DOB? (dd/mm/yyyy)",
            "What is your department?",
            "What is your semester?"
    };

    public static void main(String[] args) {
        System.out.println("InterviewServer started on port " + PORT);

        try (ServerSocket server = new ServerSocket(PORT)) {
            while (true) {
                Socket client = server.accept();
                pool.submit(new ClientHandler(client));
            }
        } catch (IOException ex) {
            System.err.println("Server error: " + ex);
        } finally {
            pool.shutdown();
        }
    }

    private static class ClientHandler implements Runnable {
        private final Socket client;

        ClientHandler(Socket client) {
            this.client = client;
        }

        @Override
        public void run() {
            String clientId = client.getRemoteSocketAddress().toString();
            System.out.println("\nClient connected: " + clientId);

            try (
                    BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
                    PrintWriter out = new PrintWriter(client.getOutputStream(), true)
            ) {
                out.println("Welcome! Answer the questions. Type 'exit' anytime to quit.");

                for (String q : QUESTIONS) {
                    out.println("Q: " + q);          // server asks
                    String answer = in.readLine();  // client replies

                    if (answer == null || answer.trim().equalsIgnoreCase("exit")) {
                        out.println("Session ended.");
                        System.out.println("Client ended session: " + clientId);
                        return;
                    }

                    System.out.println("Server asked: " + q);
                    System.out.println("Client replied: " + answer);
                }

                out.println("Thank you! All questions completed.");

            } catch (IOException ex) {
                System.err.println("Client handler error: " + ex);
            } finally {
                try { client.close(); } catch (IOException ignored) {}
                System.out.println("Client disconnected: " + clientId);
            }
        }
    }
}
