import java.net.*;

public class SpamCheck {

    public static final String BLACKHOLE = "sbl.spamhaus.org";

    // Returns true if this IP is listed as spam, false otherwise
    public static boolean isSpammIp(String ip) {
        try {
            InetAddress address = InetAddress.getByName(ip);
            byte[] quad = address.getAddress();
            String query = BLACKHOLE;

            // Reverse bytes and build query like 17.34.87.207.sbl.spamhaus.org
            for (byte octet : quad) {
                int unsignedByte = (octet < 0) ? octet + 256 : octet;
                query = unsignedByte + "." + query;
            }

            // If this lookup works, it’s a spammer
            InetAddress.getByName(query);
            return true;
        } catch (UnknownHostException e) {
            // If not found, appears legitimate
            return false;
        }
    }
}
