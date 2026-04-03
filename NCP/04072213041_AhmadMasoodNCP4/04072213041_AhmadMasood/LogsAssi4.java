import java.io.*;
import java.net.*;
import java.util.*;

public class LogAssi4 {

    public static void main(String[] args) {

        String logsFolderPath = "logs";

        File folder = new File(logsFolderPath);
        if (!folder.isDirectory()) {
            System.out.println("Folder not found: " + logsFolderPath);
            return;
        }

        Map<String, Integer> ipCounts = new HashMap<String, Integer>();
        Set<String> uniqueIPs = new HashSet<String>();

        File[] files = folder.listFiles();
        if (files == null) {
            System.out.println("No files found in folder: " + logsFolderPath);
            return;
        }

        for (File f : files) {
            if (!f.isFile()) continue;
            if (!f.getName().toLowerCase().endsWith(".log")) continue;

            System.out.println("Processing: " + f.getName());

            try (BufferedReader in = new BufferedReader(
                    new InputStreamReader(new FileInputStream(f), "UTF-8"))) {

                String entry;
                while ((entry = in.readLine()) != null) {
                    entry = entry.trim();
                    if (entry.length() == 0) continue;

                    int index = entry.indexOf(' ');
                    if (index == -1) continue; 
                    String ip = entry.substring(0, index);
                    uniqueIPs.add(ip);

                    Integer oldCount = ipCounts.get(ip);
                    if (oldCount == null) {
                        ipCounts.put(ip, 1);
                    } else {
                        ipCounts.put(ip, oldCount + 1);
                    }
                }

            } catch (IOException ex) {
                System.out.println("Error reading file " + f.getName() + ": " + ex);
            }
        }

        File spamFile = new File("spamIp.txt");
        try (PrintWriter out = new PrintWriter(
                new OutputStreamWriter(new FileOutputStream(spamFile), "UTF-8"))) {

            for (String ip : uniqueIPs) {
                try {
                    InetAddress address = InetAddress.getByName(ip);

                    // Skip private/local addresses
                    if (isPrivateOrLocalAddress(address)) {
                        System.out.println("Skipping local address: " + ip);
                        continue;
                    }

                    // Check reachability (timeout 1000 ms)
                    boolean reachable = false;
                    try {
                        reachable = address.isReachable(1000);
                    } catch (IOException e) {
                        // treat as not reachable
                        reachable = false;
                    }

                    if (!reachable) {
                        System.out.println("Unreachable IP, skipped: " + ip);
                        continue;
                    }

                    // Perform spam check
                    if (SpamCheck.isSpammIp(ip)) {
                        System.out.println("Spam detected: " + ip);
                        out.println(ip);
                    } else {
                        System.out.println("No spam detected for: " + ip);
                    }

                } catch (UnknownHostException e) {
                    System.out.println("Could not resolve IP " + ip + ": " + e);
                }
            }

        } catch (IOException ex) {
            System.out.println("Error writing spamIp.txt: " + ex);
        }

        // Sort IPs by access count (descending)
        List<Map.Entry<String, Integer>> list = new ArrayList<Map.Entry<String, Integer>>(ipCounts.entrySet());
        list.sort(Comparator.comparing(Map.Entry::getValue).reversed());

        System.out.println("IP\tAccess Count");
        for (Map.Entry<String, Integer> entry : list) {
            System.out.println(entry.getKey() + "\t" + entry.getValue());
        }
    }

    // Returns true for any private/local address (loopback, link-local, site-local)
    private static boolean isPrivateOrLocalAddress(InetAddress address) {
        return address.isAnyLocalAddress()
                || address.isLoopbackAddress()
                || address.isLinkLocalAddress()
                || address.isSiteLocalAddress();
    }
}
