package q2;

import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class TransformServer {
    private static final int PORT = 4000;

    private static final ExecutorService pool = Executors.newFixedThreadPool(50);

    public static void main(String[] args) {
        System.out.println("TransformServer starting on port " + PORT);

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
            try (
                BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
                PrintWriter out = new PrintWriter(client.getOutputStream(), true)
            ) {
                String input = in.readLine();
                if (input == null) return;

                String transformed = reverseAndInvertCase(input);
                out.println(transformed);

            } catch (IOException ex) {
                System.err.println("Client handler error: " + ex);
            } finally {
                try { client.close(); } catch (IOException ignored) {}
            }
        }

        private String reverseAndInvertCase(String s) {
            StringBuilder sb = new StringBuilder();

            for (int i = s.length() - 1; i >= 0; i--) {
                char ch = s.charAt(i);

                if (Character.isUpperCase(ch)) {
                    sb.append(Character.toLowerCase(ch));
                } else if (Character.isLowerCase(ch)) {
                    sb.append(Character.toUpperCase(ch));
                } else {
                    sb.append(ch); 
                }
            }
            return sb.toString();
        }
    }
}
