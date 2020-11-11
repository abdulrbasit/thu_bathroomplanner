/**
 * This java file sends data through html form to the postgreSQL database table Product Type.
 */

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/SaveProductType")
public class SaveProductType extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Response set as html
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Retrieve html elements
        String name = request.getParameter("name");
        int manufacturer_id = Integer.parseInt(request.getParameter("manufacturer_id"));

        int status = 0;

        try {
            // Establish Database Connection
            Connection con = DatabaseConnection.getConnection();
            //Insert data query
            PreparedStatement ps = con.prepareStatement(
                    "insert into product_type(name,manufacturer_id) values (?,?)");
            ps.setString(1, name);
            ps.setInt(2, manufacturer_id);

            //Execute Insert query
            status = ps.executeUpdate();

            // Validate query status
            if (status > 0) {
                out.print("<p>Record saved successfully!</p>");
                request.getRequestDispatcher("admin").include(request, response);
            } else {
                out.print("<p>Sorry! unable to save record</p>");
                request.getRequestDispatcher("admin").include(request, response);
            }

            // Close database connection
            con.close();

        } catch (Exception ex) {
            out.print("<p>Sorry! unable to save record</p>");
            request.getRequestDispatcher("admin").include(request, response);
        }

        out.close();
    }

}