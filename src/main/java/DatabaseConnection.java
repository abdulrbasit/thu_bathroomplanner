/**
 * This java file contains a database connection.
 */

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {

    public static Connection getConnection() {

        Connection con = null;

        try {
            // PostgreSQL connection to the database
            Class.forName("org.postgresql.Driver");
            con = DriverManager.getConnection("jdbc:postgresql://rosie.db.elephantsql.com:5432/mspgxcxr", "mspgxcxr", "yiUV914v2ToEMPbL1gi_sJ6V02YO6Hi1");

        } catch (Exception e) {
            System.out.println(e);
        }

        return con;
    }

}
