package lecture15;

public class NetworkClientTest {
    public static void main(String[] args) {
        String host = (args.length > 0) ? args[0] : "localhost";
        int port = (args.length > 1) ? Integer.parseInt(args[1]) : 8088;

        System.out.println(host);
        System.out.println(port);

        NetworkClient nwClient = new NetworkClient(host, port);
        nwClient.connect();
    }
}
