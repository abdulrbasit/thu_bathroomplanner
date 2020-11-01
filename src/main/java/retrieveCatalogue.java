import com.google.gson.JsonArray;
import com.google.gson.JsonPrimitive;
import java.io.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet(name = "retrieveCatalogue")
public class retrieveCatalogue extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonArray dbdata_manufacturer = new JsonArray();
        JsonArray dbdata_product_type = new JsonArray();
        JsonArray dbdata_product = new JsonArray();
        JsonArray dbdata_catalogue = new JsonArray();


        try
        {
            Class.forName("org.postgresql.Driver");
            Connection con = DriverManager.getConnection("jdbc:postgresql://rosie.db.elephantsql.com:5432/mspgxcxr", "mspgxcxr", "yiUV914v2ToEMPbL1gi_sJ6V02YO6Hi1");
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("select * from manufacturer");
            while (rs.next())
            {
                JsonArray row = new JsonArray();
                row.add(new JsonPrimitive(rs.getString("id")));
                row.add(new JsonPrimitive(rs.getString("name")));
                dbdata_manufacturer.add(row);
            }

            rs = stmt.executeQuery("select * from product_type");
            while (rs.next())
            {
                JsonArray row = new JsonArray();
                row.add(new JsonPrimitive(rs.getString("id")));
                row.add(new JsonPrimitive(rs.getString("name")));
                row.add(new JsonPrimitive(rs.getString("manufacturer_id")));
                dbdata_product_type.add(row);
            }

            rs = stmt.executeQuery("select * from product");
            while (rs.next())
            {
                JsonArray row = new JsonArray();
                row.add(new JsonPrimitive(rs.getString("id")));
                row.add(new JsonPrimitive(rs.getString("name")));
                row.add(new JsonPrimitive(rs.getString("image")));
                row.add(new JsonPrimitive(rs.getString("length")));
                row.add(new JsonPrimitive(rs.getString("width")));
                row.add(new JsonPrimitive(rs.getString("product_type_id")));
                dbdata_product.add(row);
            }
            dbdata_catalogue.add(dbdata_manufacturer);
            dbdata_catalogue.add(dbdata_product_type);
            dbdata_catalogue.add(dbdata_product);
            con.close();
            out.print(dbdata_catalogue);

        }
        catch (Exception e)
        {
            out.println("error");
        }
    }
}
